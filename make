SRC = x.js

lint:
	./node_modules/.bin/jslint --onevar false *.js

build: $(SRC)
	cat $^ > build/turing.js

min: build
	./node_modules/.bin/uglifyjs --no-mangle build/turing.js > build/turing.min.js

.PHONY: lint docs build