.PHONY: build
build:
	npm --no-git-tag-version --force version patch && git add . && PACKAGE_VERSION=$$(node -p 'require("./package.json").version') && git commit -am "$$PACKAGE_VERSION" && vsce package

# npm --no-git-tag-version --force version patch && git add . && PACKAGE_VERSION=$(node -p "require('./package.json').version") && git commit -am "$PACKAGE_VERSION" && vsce package

# npm --no-git-tag-version --force version patch && git add .

