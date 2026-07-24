using System;
using WebServerLight;
using WebServerLight.Routing;

var port = 9882;

WebServer
    .New()
    .Logging(LogLevel.Trace)
    .Http(port)
    .Route(MethodRoute
        .New(Method.Get)
        .Add(WebSiteRoute.New()))
    .Build()
    .Start();

Console.WriteLine($"Running test server on http://localhost:{port}/test/index.html");
Console.ReadLine(); 


