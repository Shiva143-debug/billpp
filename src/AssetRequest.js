const AssetRequest = {
    getJson : function (url,isRelativeUrl,afterResponse)
        {
            console.log(url);
            var reqUrl = isRelativeUrl ? new URL(url, document.baseURI).href :url
            
            var xhr = new XMLHttpRequest();
            reqUrl = this.appendRandomValueToBypassCache(reqUrl);
            xhr.open('GET', reqUrl);

            if(this.authToken)
            {
                xhr.setRequestHeader("x-auth-token", this.authToken);
            }
            
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    afterResponse(JSON.parse(xhr.responseText));
                }
                else {
                    console.log("^^^^^XHR Failed:" + reqUrl)
                    afterResponse(null);
                }
            };
            xhr.send();
    },
    
    appendQueryStringToCurrentUrl(queryString)
    {
        let fullurl = document.location.href + queryString;
        return fullurl;
    },

    appendRandomValueToBypassCache(url)
    {
        if(url.indexOf("?") > 0)
        {
            return url += "&rnd=" + Math.random()
        }
        else
        {
            return url += "?rnd=" + Math.random()
        }
    },
    executeApi : function (url,afterResponse)
    {
        this.getJson(url,false,afterResponse);
    },

    postData : function(url,isRelativeUrl,data,afterResponse)
    {
        var reqUrl = isRelativeUrl ? new URL(url, document.baseURI).href :url
        var xhr = new XMLHttpRequest();
        reqUrl = this.appendRandomValueToBypassCache(reqUrl);
        xhr.open('POST', reqUrl);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        if(this.authToken)
        {
            xhr.setRequestHeader("x-auth-token", this.authToken);
        }

        xhr.onload = function () {      
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                afterResponse(JSON.parse(xhr.responseText));
            }
            else {
                console.log("^^^^^XHR Failed:" + reqUrl)
                afterResponse(null);
            }
        };
        xhr.send(JSON.stringify(data));
    }
}

export default AssetRequest;