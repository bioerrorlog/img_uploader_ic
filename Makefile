BACKEND_CANISTER=img_uploader_ic

FRONTEND_CANISTER=$(BACKEND_CANISTER)_assets

BACKEND_DIR=src/$(BACKEND_CANISTER)

BACKEND_TEST_DIR=$(BACKEND_DIR)/tests

WASM_OUTDIR=_wasm_out

.PHONY: all
all: build

.PHONY: build
build:
	dfx canister create --all
	dfx build

.PHONY: install
install: build
	dfx canister install --all

.PHONY: upgrade
upgrade: build
	dfx canister install --all --mode upgrade

.PHONY: reinstall
reinstall: build
	# The --mode=reinstall is only valid when specifying a single canister
	echo yes | dfx canister install $(BACKEND_CANISTER) --mode reinstall
	echo yes | dfx canister install $(FRONTEND_CANISTER) --mode reinstall

.PHONY: module_test
module_test:
	rm -rf $(WASM_OUTDIR)
	mkdir $(WASM_OUTDIR)
	for i in $(BACKEND_TEST_DIR)/*mo; do \
		$(shell vessel bin)/moc $(shell vessel sources) -wasi-system-api -o $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm $$i; \
		wasmtime $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm; \
	done
	rm -rf $(WASM_OUTDIR)

.PHONY: canister_test
canister_test:
	# TODO: use ic-repl

	dfx canister call $(BACKEND_CANISTER) greet 'This is Test!'

.PHONY: all_test
all_test: module_test canister_test

.PHONY: clean
clean:
	rm -fr .dfx
