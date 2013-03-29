// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "net/instaweb/rewriter/public/rewrite_query.h"

#include <algorithm>  // for std::binary_search

#include "base/logging.h"
#include "net/instaweb/http/public/device_properties.h"
#include "net/instaweb/http/public/meta_data.h"
#include "net/instaweb/http/public/request_headers.h"
#include "net/instaweb/http/public/response_headers.h"
#include "net/instaweb/util/public/basictypes.h"        // for int64
#include "net/instaweb/util/public/google_url.h"
#include "net/instaweb/util/public/message_handler.h"
#include "net/instaweb/util/public/query_params.h"
#include "net/instaweb/util/public/scoped_ptr.h"
#include "net/instaweb/util/public/string.h"
#include "net/instaweb/util/public/string_multi_map.h"
#include "net/instaweb/util/public/string_util.h"
#include "net/instaweb/rewriter/public/image_rewrite_filter.h"
#include "net/instaweb/rewriter/public/resource_namer.h"
#include "net/instaweb/rewriter/public/rewrite_driver.h"
#include "net/instaweb/rewriter/public/rewrite_driver_factory.h"
#include "net/instaweb/rewriter/public/rewrite_filter.h"
#include "net/instaweb/rewriter/public/rewrite_options.h"
#include "net/instaweb/rewriter/public/server_context.h"

namespace {

// We use + and = inside the resource-options URL segment because they will not
// be quoted by UrlEscaper, unlike "," and ":".
const char kResourceFilterSeparator[] = "+";
const char kResourceOptionValueSeparator[] = "=";

const char kProxyOptionSeparator[] = ",";
const char kProxyOptionValueSeparator = '=';
const char kProxyOptionVersion[] = "v";
const char kProxyOptionMode[] = "m";
const char kProxyOptionImageQualityPreference[] = "iqp";
const char kProxyOptionValidVersionValue[] = "1";

}  // namespace

namespace net_instaweb {

const char RewriteQuery::kModPagespeed[] = "ModPagespeed";
const char RewriteQuery::kModPagespeedFilters[] = "ModPagespeedFilters";
const char RewriteQuery::kNoscriptValue[] = "noscript";

// static array of query params that have setters taking a single int64 arg.
// TODO(matterbury): Accept or solve the problem that the query parameter
// names are duplicated here and in apache/mod_instaweb.cc.
typedef void (RewriteOptions::*RewriteOptionsInt64PMF)(int64);

struct Int64QueryParam {
  const char* name_;
  RewriteOptionsInt64PMF method_;
};

static struct Int64QueryParam int64_query_params_[] = {
  { "ModPagespeedCssFlattenMaxBytes",
    &RewriteOptions::set_css_flatten_max_bytes },
  { "ModPagespeedCssInlineMaxBytes",
    &RewriteOptions::set_css_inline_max_bytes },
  // Note: If ModPagespeedImageInlineMaxBytes is specified, and
  // ModPagespeedCssImageInlineMaxBytes is not set explicitly, both the
  // thresholds get set to ModPagespeedImageInlineMaxBytes.
  { "ModPagespeedImageInlineMaxBytes",
    &RewriteOptions::set_image_inline_max_bytes },
  { "ModPagespeedCssImageInlineMaxBytes",
    &RewriteOptions::set_css_image_inline_max_bytes },
  { "ModPagespeedJsInlineMaxBytes",
    &RewriteOptions::set_js_inline_max_bytes },
  { "ModPagespeedDomainShardCount",
    &RewriteOptions::set_domain_shard_count },
  { "ModPagespeedJpegRecompressionQuality",
    &RewriteOptions::set_image_jpeg_recompress_quality },
  { "ModPagespeedJpegRecompressionQualityForSmallScreens",
    &RewriteOptions::set_image_jpeg_recompress_quality_for_small_screens },
  { "ModPagespeedJpegNumProgressiveScans",
    &RewriteOptions::set_image_jpeg_num_progressive_scans },
  { "ModPagespeedJpegNumProgressiveScansForSmallScreens",
      &RewriteOptions::set_image_jpeg_num_progressive_scans_for_small_screens },
  { "ModPagespeedImageRecompressionQuality",
    &RewriteOptions::set_image_recompress_quality },
  { "ModPagespeedWebpRecompressionQuality",
    &RewriteOptions::set_image_webp_recompress_quality },
  { "ModPagespeedWebpRecompressionQualityForSmallScreens",
    &RewriteOptions::set_image_webp_recompress_quality_for_small_screens },
  { "ModPagespeedWebpTimeoutMs",
    &RewriteOptions::set_image_webp_timeout_ms },
};

template <class HeaderT>
RewriteQuery::Status RewriteQuery::ScanHeader(
    HeaderT* headers,
    DeviceProperties* device_properties,
    RewriteOptions* options,
    MessageHandler* handler) {
  Status status = kNoneFound;

  if (headers == NULL) {
    return status;
  }

  // Tracks the headers that need to be removed.
  HeaderT headers_to_remove;

  for (int i = 0, n = headers->NumAttributes(); i < n; ++i) {
    switch (ScanNameValue(
        headers->Name(i), headers->Value(i), device_properties, options,
        handler)) {
      case kNoneFound:
        break;
      case kSuccess:
        headers_to_remove.Add(headers->Name(i), headers->Value(i));
        status = kSuccess;
        break;
      case kInvalid:
        return kInvalid;
    }
  }

  // TODO(bolian): jmarantz suggested below change.  we should make a
  // StringSetInsensitive and put all the names we want to remove including
  // XPSAClientOptions and then call RemoveAllFromSet.
  // That will be more efficient.
  for (int i = 0, n = headers_to_remove.NumAttributes(); i < n; ++i) {
    headers->Remove(headers_to_remove.Name(i), headers_to_remove.Value(i));
  }
  // kXPsaClientOptions is meant for proxy only. Remove it in any case.
  headers->RemoveAll(HttpAttributes::kXPsaClientOptions);

  return status;
}

// Scan for option-sets in query-params. We will only allow a limited number of
// options to be set. In particular, some options are risky to set per query,
// such as image inline threshold, which exposes a DOS vulnerability and a risk
// of poisoning our internal cache. Domain adjustments can potentially introduce
// a security vulnerability.
RewriteQuery::Status RewriteQuery::Scan(
    bool allow_related_options,
    RewriteDriverFactory* factory,
    ServerContext* server_context,
    GoogleUrl* request_url,
    RequestHeaders* request_headers,
    ResponseHeaders* response_headers,
    scoped_ptr<RewriteOptions>* options,
    MessageHandler* handler) {
  options->reset(NULL);

  Status status = kNoneFound;

  // To support serving resources from servers that don't share the
  // same settings as the ones generating HTML, we can put whitelisted
  // option-settings into the query-params by ID.  But we expose this
  // setting (a) only for .pagespeed. resources, not HTML, and (b)
  // only when allow_related_options is true.
  ResourceNamer namer;
  if (allow_related_options && namer.Decode(request_url->LeafSansQuery()) &&
      namer.has_options()) {
    const RewriteFilter* rewrite_filter =
        server_context->decoding_driver()->FindFilter(namer.id());
    if (rewrite_filter != NULL) {
      options->reset(factory->NewRewriteOptionsForQuery());
      status = ParseResourceOption(namer.options(), options->get(),
                                   rewrite_filter);
      if (status != kSuccess) {
        options->reset(NULL);
        return status;
      }
    }
  }

  // See if anything looks even remotely like one of our options before doing
  // any more work.  Note that when options are correctly embedded in the URL,
  // we will have a success-status here.  But we still allow a hand-added
  // query-param to override the embedded options.
  QueryParams query_params;
  query_params.Parse(request_url->Query());
  if (!MayHaveCustomOptions(query_params, request_headers, response_headers)) {
    return status;
  }

  if (options->get() == NULL) {
    options->reset(factory->NewRewriteOptionsForQuery());
  }

  scoped_ptr<DeviceProperties> device_properties;
  if (request_headers != NULL) {
    device_properties.reset(
        new DeviceProperties(server_context->user_agent_matcher()));
    device_properties->set_user_agent(
        request_headers->Lookup1(HttpAttributes::kUserAgent));
  }

  QueryParams temp_query_params;
  for (int i = 0; i < query_params.size(); ++i) {
    const GoogleString* value = query_params.value(i);
    if (value != NULL) {
      switch (ScanNameValue(
          query_params.name(i), *value, device_properties.get(), options->get(),
          handler)) {
        case kNoneFound:
          temp_query_params.Add(query_params.name(i), *value);
          break;
        case kSuccess:
          status = kSuccess;
          break;
        case kInvalid:
          return kInvalid;
      }
    } else {
      temp_query_params.Add(query_params.name(i), NULL);
    }
  }
  if (status == kSuccess) {
    // Remove the ModPagespeed* for url.
    GoogleString temp_params = temp_query_params.empty() ? "" :
        StrCat("?", temp_query_params.ToString());
    request_url->Reset(StrCat(request_url->AllExceptQuery(), temp_params,
                              request_url->AllAfterQuery()));
  }

  switch (ScanHeader<RequestHeaders>(
      request_headers, device_properties.get(), options->get(), handler)) {
    case kNoneFound:
      break;
    case kSuccess:
      status = kSuccess;
      break;
    case kInvalid:
      return kInvalid;
  }

  switch (ScanHeader<ResponseHeaders>(
      response_headers, device_properties.get(), options->get(),
      handler)) {
    case kNoneFound:
      break;
    case kSuccess:
      status = kSuccess;
      break;
    case kInvalid:
      return kInvalid;
  }

  // Set a default rewrite level in case the mod_pagespeed server has no
  // rewriting options configured.
  // Note that if any filters are explicitly set with
  // ModPagespeedFilters=..., then the call to
  // DisableAllFiltersNotExplicitlyEnabled() below will make the 'level'
  // irrelevant.
  if (status == kSuccess) {
    options->get()->SetDefaultRewriteLevel(RewriteOptions::kCoreFilters);
  }

  return status;
}

template <class HeaderT>
bool RewriteQuery::HeadersMayHaveCustomOptions(const QueryParams& params,
                                               const HeaderT* headers) {
  if (headers != NULL) {
    for (int i = 0, n = headers->NumAttributes(); i < n; ++i) {
      if (StringPiece(headers->Name(i)).starts_with(kModPagespeed)) {
        return true;
      }
    }
  }
  return false;
}

bool RewriteQuery::MayHaveCustomOptions(
    const QueryParams& params, const RequestHeaders* req_headers,
    const ResponseHeaders* resp_headers) {
  for (int i = 0, n = params.size(); i < n; ++i) {
    StringPiece name(params.name(i));
    if (name.starts_with(kModPagespeed) ||
        StringCaseEqual(name, HttpAttributes::kXPsaClientOptions)) {
      return true;
    }
  }
  if (HeadersMayHaveCustomOptions(params, req_headers)) {
    return true;
  }
  if (HeadersMayHaveCustomOptions(params, resp_headers)) {
    return true;
  }
  if (req_headers != NULL &&
      req_headers->Lookup1(HttpAttributes::kXPsaClientOptions) != NULL) {
    return true;
  }
  return false;
}

RewriteQuery::Status RewriteQuery::ScanNameValue(
    const StringPiece& name, const GoogleString& value,
    DeviceProperties* device_properties, RewriteOptions* options,
    MessageHandler* handler) {
  Status status = kNoneFound;
  if (name == kModPagespeed) {
    RewriteOptions::EnabledEnum enabled;
    if (RewriteOptions::ParseFromString(value, &enabled)) {
      options->set_enabled(enabled);
      status = kSuccess;
    } else if (value == kNoscriptValue) {
      // Disable filters that depend on custom script execution.
      options->DisableFiltersRequiringScriptExecution();
      // Blink cache hit response will also redirect to "?Noscript=" and hence
      // we need to disable blink.  Otherwise we will enter
      // blink_flow_critical_line (causing a redirect loop).
      options->DisableFilter(RewriteOptions::kPrioritizeVisibleContent);
      options->EnableFilter(RewriteOptions::kHandleNoscriptRedirect);
      status = kSuccess;
    } else {
      // TODO(sligocki): Return 404s instead of logging server errors here
      // and below.
      handler->Message(kWarning, "Invalid value for %s: %s "
                       "(should be on, off, unplugged, or noscript)",
                       name.as_string().c_str(),
                       value.c_str());
      status = kInvalid;
    }
  } else if (name == kModPagespeedFilters) {
    // When using ModPagespeedFilters query param, only the
    // specified filters should be enabled.
    if (options->AdjustFiltersByCommaSeparatedList(value, handler)) {
      status = kSuccess;
    } else {
      status = kInvalid;
    }
  } else if (StringCaseEqual(name, HttpAttributes::kXPsaClientOptions)) {
    if (UpdateRewriteOptionsWithClientOptions(
        value, device_properties, options)) {
      status = kSuccess;
    }
    // We don't want to return kInvalid, which causes 405 (kMethodNotAllowed)
    // returned to client.
  } else {
    for (unsigned i = 0; i < arraysize(int64_query_params_); ++i) {
      if (name == int64_query_params_[i].name_) {
        int64 int_val;
        if (StringToInt64(value, &int_val)) {
          RewriteOptionsInt64PMF method = int64_query_params_[i].method_;
          (options->*method)(int_val);
          status = kSuccess;
        } else {
          handler->Message(kWarning, "Invalid integer value for %s: %s",
                           name.as_string().c_str(), value.c_str());
          status = kInvalid;
        }
        break;
      }
    }
  }

  return status;
}

// In some environments it is desirable to bind a URL to the options
// that affect it.  One example of where this would be needed is if
// images are served by a separate cluster that doesn't share the same
// configuration as the mod_pagespeed instances that rewrote the HTML.
// In this case, we must encode the relevant options as query-params
// to be appended to the URL.  These should be decodable by Scan()
// above, though they don't need to be in the same verbose format that
// we document for debugging and experimentation.  They can use the
// more concise abbreviations of 2-4 letters for each option.
GoogleString RewriteQuery::GenerateResourceOption(
    StringPiece filter_id, RewriteDriver* driver) {
  const RewriteFilter* filter = driver->FindFilter(filter_id);
  StringPiece prefix("");
  GoogleString value;
  const RewriteOptions* options = driver->options();

  // All the filters & options will be encoded into the value of a
  // single query param with name kAddQueryFromOptionName ("PsolOpt").
  // The value will have the comma-separated filters IDs, and option IDs,
  // which are all given a 2-4 letter codes.  The only difference between
  // options & filters syntactically is that options have values preceded
  // by a colon:
  //   filter1,filter2,filter3,option1:value1,option2:value2

  // Add any relevant enabled filters.
  int num_filters, num_options;
  const RewriteOptions::Filter* filters = filter->RelatedFilters(&num_filters);
  for (int i = 0; i < num_filters; ++i) {
    RewriteOptions::Filter filter_enum = filters[i];
    if (options->Enabled(filter_enum)) {
      StrAppend(&value, prefix, RewriteOptions::FilterId(filter_enum));
      prefix = kResourceFilterSeparator;
    }
  }

  // Add any non-default options.
  GoogleString option_value;
  const RewriteOptions::OptionEnum* opts = filter->RelatedOptions(&num_options);
  for (int i = 0; i < num_options; ++i) {
    RewriteOptions::OptionEnum option = opts[i];
    const char* id;
    bool was_set = false;
    if (options->OptionValue(option, &id, &was_set, &option_value) && was_set) {
      StrAppend(&value, prefix, id, kResourceOptionValueSeparator,
                option_value);
      prefix = kResourceFilterSeparator;
    }
  }
  return value;
}

RewriteQuery::Status RewriteQuery::ParseResourceOption(
    StringPiece value, RewriteOptions* options, const RewriteFilter* filter) {
  Status status = kNoneFound;
  StringPieceVector filters_and_options;
  SplitStringPieceToVector(value, kResourceFilterSeparator,
                           &filters_and_options, true);

  // We will want to validate any filters & options we are trying to set
  // with this mechanism against the whitelist of whatever the filter thinks is
  // needed.  But do this lazily.
  int num_filters, num_options;
  const RewriteOptions::Filter* filters = filter->RelatedFilters(&num_filters);
  const RewriteOptions::OptionEnum* opts = filter->RelatedOptions(&num_options);

  for (int i = 0, n = filters_and_options.size(); i < n; ++i) {
    StringPieceVector name_value;
    SplitStringPieceToVector(filters_and_options[i],
                             kResourceOptionValueSeparator, &name_value, true);
    switch (name_value.size()) {
      case 1: {
        RewriteOptions::Filter filter =
            RewriteOptions::LookupFilterById(name_value[0]);
        if ((filter == RewriteOptions::kEndOfFilters) ||
            !std::binary_search(filters, filters + num_filters, filter)) {
          status = kInvalid;
        } else {
          options->EnableFilter(filter);
          status = kSuccess;
        }
        break;
      }
      case 2: {
        RewriteOptions::OptionEnum option_enum =
            RewriteOptions::LookupOptionEnumById(name_value[0]);
        if ((option_enum != RewriteOptions::kEndOfOptions) &&
            std::binary_search(opts, opts + num_options, option_enum) &&
            (options->SetOptionFromEnum(option_enum, name_value[1])
             == RewriteOptions::kOptionOk)) {
          status = kSuccess;
        } else {
          status = kInvalid;
        }
        break;
      }
      default:
        status = kInvalid;
    }
  }
  options->SetRewriteLevel(RewriteOptions::kPassThrough);
  options->DisableAllFiltersNotExplicitlyEnabled();
  return status;
}

bool RewriteQuery::ParseProxyMode(
    const GoogleString* mode_name, ProxyMode* mode) {
  int mode_value = 0;
  if (mode_name != NULL &&
      !mode_name->empty() &&
      StringToInt(*mode_name, &mode_value) &&
      mode_value >= kProxyModeDefault &&
      mode_value <= kProxyModeNoTransform) {
    *mode = static_cast<ProxyMode>(mode_value);
    return true;
  }
  return false;
}

bool RewriteQuery::ParseImageQualityPreference(
    const GoogleString* preference_name, ImageQualityPreference* preference) {
  int value = 0;
  if (preference_name != NULL &&
      !preference_name->empty() &&
      StringToInt(*preference_name, &value) &&
      value >= kImageQualityDefault &&
      value <= kImageQualityHigh) {
    *preference = static_cast<ImageQualityPreference>(value);
    return true;
  }
  return false;
}

bool RewriteQuery::ParseClientOptions(
    const StringPiece& client_options, ProxyMode* proxy_mode,
    ImageQualityPreference* image_quality_preference) {
  StringMultiMapSensitive options;
  options.AddFromNameValuePairs(
      client_options, kProxyOptionSeparator, kProxyOptionValueSeparator,
      true);

  const GoogleString* version_value = options.Lookup1(kProxyOptionVersion);
  // We only support version value of kProxyOptionValidVersionValue for now.
  // New supported version might be added later.
  if (version_value != NULL &&
      *version_value == kProxyOptionValidVersionValue) {
    *proxy_mode = kProxyModeDefault;
    *image_quality_preference = kImageQualityDefault;
    ParseProxyMode(options.Lookup1(kProxyOptionMode), proxy_mode);

    if (*proxy_mode == kProxyModeDefault) {
      ParseImageQualityPreference(
          options.Lookup1(kProxyOptionImageQualityPreference),
          image_quality_preference);
    }
    return true;
  }
  return false;
}

bool RewriteQuery::SetEffectiveImageQualities(
    ImageQualityPreference quality_preference,
    DeviceProperties* device_properties,
    RewriteOptions* options) {
  if (quality_preference == kImageQualityDefault ||
      device_properties == NULL) {
    return false;
  }
  // TODO(bolian): Set jpeg and webp image qualities based on screen
  // resolution and client hint options.
  // For now, do nothing and keep using default values.
  return false;
}

bool RewriteQuery::UpdateRewriteOptionsWithClientOptions(
    const GoogleString& client_options, DeviceProperties* device_properties,
    RewriteOptions* options) {
  ProxyMode proxy_mode = kProxyModeDefault;
  ImageQualityPreference quality_preference = kImageQualityDefault;
  if (!ParseClientOptions(client_options, &proxy_mode, &quality_preference)) {
    return false;
  }

  if (proxy_mode == kProxyModeNoTransform) {
    options->DisableAllFilters();
    return true;
  } else if (proxy_mode == kProxyModeNoImageTransform) {
    ImageRewriteFilter::DisableRelatedFilters(options);
    return true;
  } else if (proxy_mode == kProxyModeDefault) {
    return SetEffectiveImageQualities(
        quality_preference, device_properties, options);
  }
  DCHECK(false);
  return false;
}

}  // namespace net_instaweb
