.DELETE_ON_ERROR:
.PHONY: all build lint lint-fix qa test

default: build

CATALYST_SCRIPTS:=npx catalyst-scripts

HSR_SRC:=src
HSR_FILES:=$(shell find $(HSR_SRC) \( -name "*.js" -o -name "*.mjs" \) -not -path "*/test/*" -not -name "*.test.js")
HSR_ALL_FILES:=$(shell find $(HSR_SRC) \( -name "*.js" -o -name "*.mjs" \))
HSR_TEST_SRC_FILES:=$(shell find $(HSR_SRC) -name "*.js")
HSR_TEST_BUILT_FILES:=$(patsubst $(HSR_SRC)/%, test-staging/%, $(HSR_TEST_SRC_FILES))
HSR:=dist/liq-projects.js

BUILD_TARGETS:=$(HSR)

# build rules
build: $(BUILD_TARGETS)

all: build

$(HSR): package.json $(HSR_FILES)
	JS_SRC=$(HSR_SRC) $(CATALYST_SCRIPTS) build

# test
$(HSR_TEST_BUILT_FILES) &: $(HSR_ALL_FILES)
	JS_SRC=$(HSR_SRC) $(CATALYST_SCRIPTS) pretest

.test-marker: $(HSR_TEST_BUILT_FILES)
	JS_SRC=test-staging $(CATALYST_SCRIPTS) test
	touch $@

test: .test-marker

# lint rules
.lint-marker: $(HSR_ALL_FILES)
	JS_LINT_TARGET=$(HSR_SRC) $(CATALYST_SCRIPTS) lint
	touch $@

lint: .lint-marker

lint-fix:
	JS_LINT_TARGET=$(HSR_SRC) $(CATALYST_SCRIPTS) lint-fix

qa: test lint
