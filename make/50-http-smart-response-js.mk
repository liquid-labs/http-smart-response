# This file was generated by @liquid-labs/sdlc-projects-workflow-local-node-build.
# Refer to https://npmjs.com/package/@liquid-labs/sdlc-projects-workflow-local-
# node-build for further details

#####
# build dist/http-smart-response.js
#####

SDLC_HTTP_SMART_RESPONSE_JS:=$(DIST)/http-smart-response.js
SDLC_HTTP_SMART_RESPONSE_JS_ENTRY=$(SRC)/index.js
BUILD_TARGETS+=$(SDLC_HTTP_SMART_RESPONSE_JS)

$(SDLC_HTTP_SMART_RESPONSE_JS): package.json $(SDLC_ALL_NON_TEST_JS_FILES_SRC)
	JS_BUILD_TARGET=$(SDLC_HTTP_SMART_RESPONSE_JS_ENTRY) \
	  JS_OUT=$@ \
	  $(SDLC_ROLLUP) --config $(SDLC_ROLLUP_CONFIG)

#####
# end dist/http-smart-response.js
#####
