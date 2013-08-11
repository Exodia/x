SRC = x.js

lint:
	./node_modules/.bin/jslint --onevar false *.js

build: $(SRC)
	cat $^ > build/turing.js

min: build
	./node_modules/.bin/uglifyjs --no-mangle build/x.js > build/x.min.js

test:
	mocha --reporter list

test-cov:
	jscoverage src src-cov && JSCOV=1 mocha -R html-cov > coverage.html

.PHONY: test-cov
