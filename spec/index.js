/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development Company, LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
(function () {
  'use strict';

  describe('openstack-registry-hooks', function () {
    var oldProc = process.exit;
    var procSpy;
    var boundScope = {
      log: {
        info: function () {
        }
      }
    };

    beforeEach(function () {
      procSpy = jasmine.createSpy('exit');
      process.exit = procSpy;
    });

    afterEach(function () {
      process.exit = oldProc;
    });

    it('should implement the entire hook interface', function () {
      var hooks = require('../index');

      expect(hooks.beforeAll).toBeDefined();
      expect(hooks.afterAll).toBeDefined();
      expect(hooks.globalIndexJson).toBeDefined();
      expect(hooks.indexJson).toBeDefined();
      expect(hooks.versionJson).toBeDefined();
      expect(hooks.tarball).toBeDefined();
      expect(hooks.afterTarball).toBeDefined();
      expect(hooks.startup).toBeDefined();
      expect(hooks.shasumCheck).toBeDefined();
    });

    it('should noop on most methods', function () {
      var hooks = require('../index');

      var methods = ['beforeAll', 'globalIndexJson', 'versionJson', 'tarball',
                     'afterTarball', 'startup', 'shasumCheck'];
      methods.forEach(function (methodName) {
        var data = {};
        var cb = jasmine.createSpy('spy');
        hooks[methodName](data, cb);

        expect(data).toEqual({});
        expect(cb).toHaveBeenCalledWith(null, true);
      });
    });

    describe('afterAll', function () {
      it('should noop on afterAll if the sequences do not match',
        function () {
          var hooks = require('../index');
          var cb = jasmine.createSpy('spy');
          var data = {seq: 2, latestSeq: 20};

          hooks.afterAll.call(boundScope, data, cb);

          expect(procSpy).not.toHaveBeenCalled();
          expect(cb).toHaveBeenCalledWith(null, true);
        });

      it('should not error if sequences are not defined',
        function () {
          var hooks = require('../index');
          var cb = jasmine.createSpy('spy');
          var data = {};

          hooks.afterAll.call(boundScope, data, cb);

          expect(procSpy).not.toHaveBeenCalled();
          expect(cb).toHaveBeenCalledWith(null, true);
        });

      it('should process.exit() if sequences match',
        function () {
          var hooks = require('../index');
          var cb = jasmine.createSpy('spy');
          var data = {seq: 20, latestSeq: 20};

          hooks.afterAll.call(boundScope, data, cb);

          expect(procSpy).toHaveBeenCalledWith(0);
        });
    });

    describe('indexJson', function () {
      it('should sanitize versions', function () {
        var shellJsData = require('./helpers/shelljs.json');
        var oldKeys = Object.keys(shellJsData.json.versions);
        var cb = jasmine.createSpy('spy');

        expect(oldKeys).toContain('0.0.1alpha1');

        var indexJsonHook = require('../lib/index_json');
        indexJsonHook(shellJsData, cb);
        var newKeys = Object.keys(shellJsData.json.versions);

        expect(newKeys).toContain('0.0.1-alpha1');
        expect(newKeys).not.toContain('0.0.1alpha1');
      });
    });
  });
})();
