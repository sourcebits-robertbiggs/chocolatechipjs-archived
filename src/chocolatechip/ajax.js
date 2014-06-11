    $.extend($, {
      /*
         options = {
            url : 'the/path/here',
            type : ('GET', 'POST', PUT, 'DELETE'),
            data : myData,
            async : 'synch' || 'asynch',
            user : username (string),
            password : password (string),
            dataType : ('html', 'json', 'text', 'script', 'xml'),
            headers : {},
            success : callbackForSuccess,
            error : callbackForError,
            context: null
         }
      */
      ajax : function ( options ) {
         // Default settings:
         var settings = {
            type: 'GET',
            beforeSend: $.noop,
            success: $.noop,
            error: $.noop,
            context: null,
            async: true,
            timeout: 0
         };
         $.extend(settings, options);
         var dataTypes = {
            script: 'text/javascript, application/javascript',
            json:   'application/json',
            xml:    'application/xml, text/xml',
            html:   'text/html',
            text:   'text/plain'
         };
         var xhr = new XMLHttpRequest();
         var deferred = new $.Deferred();
         var type = settings.type || 'get';
         var async  = settings.async || false;      
         var params = settings.data || null;
         var context = options.context || deferred;
         xhr.queryString = params;
         xhr.timeout = settings.timeout ? settings.timeout : 0;
         xhr.open(type, settings.url, async);
         if (!!settings.headers) {  
            for (var prop in settings.headers) { 
               if(settings.headers.hasOwnProperty(prop)) { 
                  xhr.setRequestHeader(prop, settings.headers[prop]);
               }
            }
         }
         if (settings.dataType) {
            xhr.setRequestHeader('Content-Type', dataTypes[settings.dataType]);
         }
         xhr.handleResp = settings.success; 
         
         var handleResponse = function() {
            if(xhr.status === 0 && xhr.readyState === 4 || xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4 || xhr.status === 304 && xhr.readyState === 4 ) {
               if (settings.dataType) {
                  if (settings.dataType === 'json') {
                     xhr.handleResp(JSON.parse(xhr.responseText));
                     deferred.resolve(xhr.responseText, settings.context, xhr);
                  } else {
                     xhr.handleResp(xhr.responseText);
                     deferred.resolve(xhr.responseText, settings.context, xhr);
                  }
               } else {
                  xhr.handleResp(xhr.responseText);
                  deferred.resolve(xhr.responseText, settings.context, xhr);
               }
            } else if(xhr.status >= 400) {
               if (!!error) {
                  error(xhr);
                  deferred.reject(xhr.status, settings.context, xhr);
               }
            }
         };

         if (async) {
            if (settings.beforeSend !== $.noop) {
               settings.beforeSend(xhr, settings);
            }
            xhr.onreadystatechange = handleResponse;
            xhr.send(params);
         } else {
            if (settings.beforeSend !== $.noop) {
               settings.beforeSend(xhr, settings);
            }
            xhr.send(params);
            handleResponse();
         }
         return deferred;
      },
      
      // Parameters: url, data, success, dataType.
      get : function ( url, data, success, dataType ) {
         if (!url) {
            return;
         }
         if (!data) {
            return $.ajax({url : url, type: 'GET'}); 
         }
         if (!dataType) {
            dataType = null;
         }
         if (typeof data === 'function' && !success) {
            return $.ajax({url : url, type: 'GET', success : data});
         } else if (typeof data === 'object' && typeof success === 'function') {
            return $.ajax({url : url, type: 'GET', data : data, dataType : dataType});
         }
      },
      
      // Parameters: url, data, success.
      getJSON : function ( url, data, success ) {
         if (!url) {
             return;
         }
         if (!data) {
            return;
         }
         if (typeof data === 'function' && !success) {
            $.ajax({url : url, type: 'GET', async: true, success : data, dataType : 'json'});
         } else if (typeof data === 'object' && typeof success === 'function') {
            $.ajax({url : url, type: 'GET', data : data, dataType : 'json'});
         }
      },

      // Parameters: url, callback.
      JSONP : function ( url, callback, callbackType ) {
         var fn = 'fn_' + $.uuidNum(),
         script = document.createElement('script'),
         cb = callbackType || 'callback=?',
         head = $('head')[0];
         window[fn] = function(data) {
            head.removeChild(script);
            callback && callback(data);
            delete window[fn];
         };
         var strippedCallbackStr = cb.substr(0,cb.length-1);
         script.src = url.replace(cb, strippedCallbackStr + fn);
         head.appendChild(script);
      },
      
      // Parameters: url, data, success, dataType.
      post : function ( url, data, success, dataType ) {
         if (!url) {
            return;
         }
         if (!data) {
            return;
         }
         if (typeof data === 'function' && !dataType) {
            if (typeof success === 'string') {
               dataType = success;
            }
            $.ajax({url : url, type: 'POST', success : data, dataType : dataType});
         } else if (typeof data === 'object' && typeof success === 'function') {
            $.ajax({url : url, type: 'POST', data : data, dataType : dataType});
         }
      }
   });