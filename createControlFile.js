(function () {
    'use strict';
    var fs = require('fs');
    var packageFile = JSON.parse(fs.readFileSync('package.json'), 'utf8');

    // Takes a package.json formmated object and generates a control file for a NI Package
    var createControlText = function (packageInfo) {
        // Helper functions for building up control file

        // Normal package names are just passed through. Scoped package names are changed to {scope}-{name}
        var npmNameToPackageAttribute = function (name) {
            var matches = name.match(/@(.+)\/(.+)/);
            if (matches !== null) {
                return matches[1] + '-' + matches[2];
            }

            return name;
        };

        var requiredPackageField = function (field) {
            var value = packageInfo[field];
            if (typeof value !== 'string' || value.length <= 0) {
                throw new Error('Expected package.json field ' + field + ' to be a non-empty string. The following was provided: ' + value);
            }

            return value;
        };

        var dependencies = function () {
            if (packageInfo['nipkg-settings'] === undefined || Array.isArray(packageInfo['nipkg-settings'].dependencies) === false) {
                return undefined;
            }

            return packageInfo['nipkg-settings'].dependencies.join(', ');
        };

        // Required fields form the package.json to map to the control file
        // Strictly speaking Homepage is not required but I think it's valuable. At the very least point to a NI Community page for people to ask questions.
        var controlFileAttributes = {
            Package: npmNameToPackageAttribute(requiredPackageField('name')),
            Version: requiredPackageField('version'),
            Description: requiredPackageField('description'), // TODO maybe need additional validation for multiline?
            Homepage: requiredPackageField('homepage'),
            Maintainer: requiredPackageField('author'),
            Architecture: 'windows_x64',
            'XB-Plugin': 'file',
            Dependencies: dependencies()
        };

        var controlFileText = Object.entries(controlFileAttributes).filter(function (entry) {
            return entry[1] !== undefined;
        }).map(function (entry) {
            return entry[0] + ': ' + entry[1];
        }).join('\n');

        return controlFileText;
    };

    var controlText = createControlText(packageFile);
    fs.writeFileSync('dist/package/control/control', controlText);
}());
