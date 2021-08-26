.PHONY: build
build:
	npm run vsce-package


.PHONY: bump
bump:
	npm --no-git-tag-version --force version patch && \
	git add . && \
	PACKAGE_VERSION=$$(node -p 'require("./package.json").version') && \
	git commit -am "$$PACKAGE_VERSION"


.PHONY: bump-build
bump-build:	bump build
