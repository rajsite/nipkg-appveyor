(function () {
    'use strict';
    var fs = require('fs');
    var packageFile = JSON.parse(fs.readFileSync('package.json'), 'utf8');

    // Takes a package.json formmated object and generates a control file for a NI Package
    var createControlText = function (packageInfo) {
        // Required fields form the package.json to map to the control file
        // Strictly speaking Homepage is not required but I think it's valuable. At the very least point to a NI Community page for people to ask questions.
        var requiredControlFileAttributesPackageMap = {
            Package: 'name',
            Version: 'version',
            Description: 'description', // TODO maybe need additional validation for multiline?
            Homepage: 'homepage',
            Maintainer: 'author',
        };

        var requiredControlFileAttributes = Object.entries(requiredControlFileAttributesPackageMap).reduce(function validateValue (obj, entry) {
            var attribute = entry[0];
            var packageKeyName = entry[1];
            var value = packageInfo[packageKeyName];

            if (typeof value !== 'string' || value.length <= 0) {
                throw new Error('The control file attribute ' + attribute  + ' corresponding to package key ' + packageKeyName + ' is required and must be a non-empty string. The following was provided: ' + value);
            }

            obj[attribute] = value;
            return obj;
        }, {});

        var staticControlFileAttributes = {
            Architecture: 'windows_x64',
            'XB-Plugin': 'file' // TODO maybe make this user configurable
        };

        // TODO do a fancy map thing here too maybe
        var optionalControlFileAttributesUnfiltered = {
            Dependencies: packageInfo.nipkg  ? (Array.isArray(packageInfo.nipkg.dependencies) ? packageInfo.nipkg.dependencies.join(', ') : undefined) : undefined
        };

        var optionalControlFileAttributes = Object.entries(optionalControlFileAttributesUnfiltered).reduce(function (obj, entry) {
            var attribute = entry[0];
            var value = entry[1];

            if (value !== undefined) {
                obj[attribute] = value;
            }
            return obj;
        }, {});

        var allControlFileAttributes = Object.assign({}, requiredControlFileAttributes, staticControlFileAttributes, optionalControlFileAttributes);
        var controlFileText = Object.entries(allControlFileAttributes).map(function (entry) {
            var attribute = entry[0];
            var value = entry[1];

            return attribute + ': ' + value;
        }).join('\n');

        return controlFileText;
    };

    var controlText = createControlText(packageFile);
    fs.writeFileSync('dist/package/control/control', controlText);
}());
