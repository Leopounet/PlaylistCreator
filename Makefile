build:
	if [ ! -d "build/" ]; then \
		mkdir build; \
	fi
	tsc
	cp manifest.json build/manifest.json
	cp -r icons/ build/
	cp -r html/ build/
	cd build/ && parcel build **/*.js
	rm -rf build/dist/**/*.map
	rm -rf build/common/ build/spotify/ build/whatthetune/

run: 
	cd build/ && web-ext run

package: build
	cd build/ && web-ext build && web-ext sign --api-key ${JWTIssuer} --api-secret ${JWTSecret}
	if [ -d "web-ext-artifacts" ]; then \
		rm -rf "web-ext-artifacts"; \
	fi
	mv build/web-ext-artifacts .

clean: 
	rm -rf build/ web-ext-artifacts/

.PHONY: build clean