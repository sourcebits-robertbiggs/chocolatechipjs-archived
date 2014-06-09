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
         var dataTypes = {
            script: 'text/javascript, application/javascript',
            json:   'application/json',
            xml:    'application/xml, text/xml',
            html:   'text/html',
            text:   'text/plain'
         };
         var o = options ? options : {};
         var success = null;
         var error = options.error || $.noop;
         if (!!options) {
            if (!!o.success) {
               success = o.success;
            }
         }
         var request = new XMLHttpRequest();
         var deferred = new $.Deferred();
         var type = o.type || 'get';
         var async  = o.async || false;      
         var params = o.data || null;
         var context = options.context || deferred;
         request.queryString = params;
         request.timeout = o.timeout ? o.timeout : 0;
         request.open(type, o.url, async);
         if (!!o.headers) {  
            for (var prop in o.headers) { 
               if(o.headers.hasOwnProperty(prop)) { 
                  request.setRequestHeader(prop, o.headers[prop]);
               }
            }
         }
         if (o.dataType) {
            request.setRequestHeader('Content-Type', dataTypes[o.dataType]);
         }
         request.handleResp = (success !== null) ? success : $.noop; 
         
         var handleResponse = function() {
            if(request.status === 0 && request.readyState === 4 || request.status >= 200 && request.status < 300 && request.readyState === 4 || request.status === 304 && request.readyState === 4 ) {
               if (o.dataType) {
                  if (o.dataType === 'json') {
                     request.handleResp(JSON.parse(request.responseText));
                     deferred.resolve(context, request, request.responseText);
                  } else {
                     request.handleResp(request.responseText);
                     deferred.resolve(context, request, request.responseText);
                  }
               } else {
                  request.handleResp(request.responseText);
                  deferred.resolve(context, request, request.responseText);
               }
            } else if(request.status >= 400) {
               if (!!error) {
                  error(request);
                  deferred.reject(options.context, request, request.responseText);
               }
            }
         };

         if (async) {
            request.onreadystatechange = handleResponse;
            request.send(params);
         } else {
            request.send(params);
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