# Slow Start

Starting the api locally with `func start --verbose` takes 4 minutes 13 seconds.

```
func start --verbose
'local.settings.json' found in root directory (/home/nick/github/spy/api).
Resolving worker runtime to 'dotnet-isolated'.
  Determining projects to restore...
  All projects are up-to-date for restore.
/home/nick/.asdf/installs/dotnet/9.0.310/sdk/9.0.310/Current/SolutionFile/ImportAfter/Microsoft.NET.Sdk.Solution.targets(36,5): warning NETSDK1194: The "--output" option isn't supported when building a solution. Specifying a solution-level output path results in all projects copying outputs to the same directory, which can lead to inconsistent builds. [/home/nick/github/spy/api/api.sln]
  Determining projects to restore...
  All projects are up-to-date for restore.
  WorkerExtensions -> /home/nick/github/spy/api/obj/Debug/net9.0/WorkerExtensions/bin/Release/net8.0/Microsoft.Azure.Functions.Worker.Extensions.dll
  api -> /home/nick/github/spy/api/bin/output/api.dll

Build succeeded.

/home/nick/.asdf/installs/dotnet/9.0.310/sdk/9.0.310/Current/SolutionFile/ImportAfter/Microsoft.NET.Sdk.Solution.targets(36,5): warning NETSDK1194: The "--output" option isn't supported when building a solution. Specifying a solution-level output path results in all projects copying outputs to the same directory, which can lead to inconsistent builds. [/home/nick/github/spy/api/api.sln]
    1 Warning(s)
    0 Error(s)

Time Elapsed 00:00:03.70


Selected out-of-process host.


                  %%%%%%
                 %%%%%%
            @   %%%%%%    @
          @@   %%%%%%      @@
       @@@    %%%%%%%%%%%    @@@
     @@      %%%%%%%%%%        @@
       @@         %%%%       @@
         @@      %%%       @@
           @@    %%      @@
                %%
                %


Azure Functions Core Tools
Core Tools Version:       4.6.0+ab90faafcab539d63cd3d0ce5faf1bca4395fccc (64-bit)
Function Runtime Version: 4.1045.200.25556

4 minute wait here

[2026-02-07T15:44:59.782Z] Found /home/nick/github/spy/api/api.csproj. Using for user secrets file configuration.
[2026-02-07T15:45:00.077Z] Building host: version spec: , startup suppressed: 'False', configuration suppressed: 'False', startup operation id: '1ae2a0a0-3638-41ec-b7bc-55364f55e86b'
[2026-02-07T15:45:00.101Z] Reading host configuration file '/home/nick/github/spy/api/bin/output/host.json'
[2026-02-07T15:45:00.102Z] Host configuration file read:
[2026-02-07T15:45:00.102Z] {
[2026-02-07T15:45:00.102Z]   "version": "2.0",
[2026-02-07T15:45:00.102Z]   "logging": {
[2026-02-07T15:45:00.102Z]     "applicationInsights": {
[2026-02-07T15:45:00.102Z]       "samplingSettings": {
[2026-02-07T15:45:00.102Z]         "isEnabled": true,
[2026-02-07T15:45:00.102Z]         "excludedTypes": "Request"
[2026-02-07T15:45:00.102Z]       },
[2026-02-07T15:45:00.102Z]       "enableLiveMetricsFilters": true
[2026-02-07T15:45:00.102Z]     }
[2026-02-07T15:45:00.102Z]   }
[2026-02-07T15:45:00.102Z] }
[2026-02-07T15:45:00.124Z] Extension Bundle not loaded. Loading extensions from /home/nick/github/spy/api/bin/output. BundleConfigured: False, PrecompiledFunctionApp: False, LegacyBundle: False, DotnetIsolatedApp: True, isLogicApp: False
[2026-02-07T15:45:00.124Z] Script Startup resetting load context with base path: '/home/nick/github/spy/api/bin/output/.azurefunctions'.
[2026-02-07T15:45:00.130Z] Loading startup extension 'Startup'
[2026-02-07T15:45:00.154Z] Loaded extension 'Startup' (1.0.0.0)
[2026-02-07T15:45:00.174Z] Reading host configuration file '/home/nick/github/spy/api/bin/output/host.json'
[2026-02-07T15:45:00.174Z] Host configuration file read:
[2026-02-07T15:45:00.174Z] {
[2026-02-07T15:45:00.174Z]   "version": "2.0",
[2026-02-07T15:45:00.174Z]   "logging": {
[2026-02-07T15:45:00.174Z]     "applicationInsights": {
[2026-02-07T15:45:00.174Z]       "samplingSettings": {
[2026-02-07T15:45:00.174Z]         "isEnabled": true,
[2026-02-07T15:45:00.174Z]         "excludedTypes": "Request"
[2026-02-07T15:45:00.174Z]       },
[2026-02-07T15:45:00.174Z]       "enableLiveMetricsFilters": true
[2026-02-07T15:45:00.174Z]     }
[2026-02-07T15:45:00.174Z]   }
[2026-02-07T15:45:00.174Z] }
[2026-02-07T15:45:00.207Z] Starting host metrics provider.
[2026-02-07T15:45:00.326Z] Initializing Warmup Extension.
[2026-02-07T15:45:00.358Z] Initializing Host. OperationId: '1ae2a0a0-3638-41ec-b7bc-55364f55e86b'.
[2026-02-07T15:45:00.362Z] Host initialization: ConsecutiveErrors=0, StartupCount=1, OperationId=1ae2a0a0-3638-41ec-b7bc-55364f55e86b
[2026-02-07T15:45:00.383Z] Loading functions metadata
[2026-02-07T15:45:00.385Z] Worker indexing is enabled
[2026-02-07T15:45:00.386Z] Fetching metadata for workerRuntime: dotnet-isolated
[2026-02-07T15:45:00.386Z] Reading functions metadata (Worker)
[2026-02-07T15:45:00.901Z] {
[2026-02-07T15:45:00.901Z]   "ProcessId": 17629,
[2026-02-07T15:45:00.901Z]   "RuntimeIdentifier": "linux-x64",
[2026-02-07T15:45:00.901Z]   "WorkerVersion": "2.51.0.0",
[2026-02-07T15:45:00.901Z]   "ProductVersion": "2.51.0\u002B456cca3aa0f0f42db5f21f8ed7a1277278b6eb2a",
[2026-02-07T15:45:00.901Z]   "FrameworkDescription": ".NET 9.0.12",
[2026-02-07T15:45:00.901Z]   "OSDescription": "Ubuntu 25.10",
[2026-02-07T15:45:00.901Z]   "OSArchitecture": "X64",
[2026-02-07T15:45:00.901Z]   "CommandLine": "/home/nick/github/spy/api/bin/output/api.dll --host 127.0.0.1 --port 36427 --workerId 8fc4814b-8ba4-4556-97a7-c0c2a9fd85e9 --requestId d6799e55-df44-4eb0-a3b3-ad2b771d7ab1 --grpcMaxMessageLength 2147483647 --functions-uri http://127.0.0.1:36427/ --functions-worker-id 8fc4814b-8ba4-4556-97a7-c0c2a9fd85e9 --functions-request-id d6799e55-df44-4eb0-a3b3-ad2b771d7ab1 --functions-grpc-max-message-length 2147483647"
[2026-02-07T15:45:00.901Z] }
[2026-02-07T15:45:01.014Z] 5 functions found (Worker)
[2026-02-07T15:45:01.023Z] Reading functions metadata (Custom)
[2026-02-07T15:45:01.029Z] 0 functions found (Custom)
[2026-02-07T15:45:01.035Z] 5 functions loaded
[2026-02-07T15:45:01.039Z] LoggerFilterOptions
[2026-02-07T15:45:01.039Z] {
[2026-02-07T15:45:01.039Z]   "MinLevel": "None",
[2026-02-07T15:45:01.039Z]   "Rules": [
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.039Z]       "ProviderName": null,
[2026-02-07T15:45:01.039Z]       "CategoryName": "Microsoft.Hosting.Lifetime",
[2026-02-07T15:45:01.039Z]       "LogLevel": "None",
[2026-02-07T15:45:01.039Z]       "Filter": null
[2026-02-07T15:45:01.039Z]     },
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.039Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.039Z]       "CategoryName": null,
[2026-02-07T15:45:01.039Z]       "LogLevel": "None",
[2026-02-07T15:45:01.039Z]       "Filter": null
[2026-02-07T15:45:01.039Z]     },
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.039Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.039Z]       "CategoryName": null,
[2026-02-07T15:45:01.039Z]       "LogLevel": null,
[2026-02-07T15:45:01.039Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.039Z]     },
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.039Z]       "ProviderName": null,
[2026-02-07T15:45:01.039Z]       "CategoryName": null,
[2026-02-07T15:45:01.039Z]       "LogLevel": null,
[2026-02-07T15:45:01.039Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.039Z]     },
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.039Z]       "ProviderName": null,
[2026-02-07T15:45:01.039Z]       "CategoryName": null,
[2026-02-07T15:45:01.039Z]       "LogLevel": null,
[2026-02-07T15:45:01.039Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.039Z]     },
[2026-02-07T15:45:01.039Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": "Microsoft.Azure.WebJobs.Script.WebHost.Diagnostics.SystemLoggerProvider",
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": "None",
[2026-02-07T15:45:01.040Z]       "Filter": null
[2026-02-07T15:45:01.040Z]     },
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": "Microsoft.Azure.WebJobs.Script.WebHost.Diagnostics.SystemLoggerProvider",
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": null,
[2026-02-07T15:45:01.040Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.040Z]     },
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": null,
[2026-02-07T15:45:01.040Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.040Z]     }
[2026-02-07T15:45:01.040Z]   ]
[2026-02-07T15:45:01.040Z] }
[2026-02-07T15:45:01.040Z] LoggerFilterOptions
[2026-02-07T15:45:01.040Z] {
[2026-02-07T15:45:01.040Z]   "MinLevel": "None",
[2026-02-07T15:45:01.040Z]   "Rules": [
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": null,
[2026-02-07T15:45:01.040Z]       "CategoryName": "Microsoft.Hosting.Lifetime",
[2026-02-07T15:45:01.040Z]       "LogLevel": "None",
[2026-02-07T15:45:01.040Z]       "Filter": null
[2026-02-07T15:45:01.040Z]     },
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": "None",
[2026-02-07T15:45:01.040Z]       "Filter": null
[2026-02-07T15:45:01.040Z]     },
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": null,
[2026-02-07T15:45:01.040Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.040Z]     },
[2026-02-07T15:45:01.040Z]     {
[2026-02-07T15:45:01.040Z]       "ProviderName": null,
[2026-02-07T15:45:01.040Z]       "CategoryName": null,
[2026-02-07T15:45:01.040Z]       "LogLevel": null,
[2026-02-07T15:45:01.040Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.041Z]     },
[2026-02-07T15:45:01.041Z]     {
[2026-02-07T15:45:01.041Z]       "ProviderName": null,
[2026-02-07T15:45:01.041Z]       "CategoryName": null,
[2026-02-07T15:45:01.041Z]       "LogLevel": null,
[2026-02-07T15:45:01.041Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.041Z]     },
[2026-02-07T15:45:01.041Z]     {
[2026-02-07T15:45:01.041Z]       "ProviderName": "Microsoft.Azure.WebJobs.Script.WebHost.Diagnostics.SystemLoggerProvider",
[2026-02-07T15:45:01.041Z]       "CategoryName": null,
[2026-02-07T15:45:01.041Z]       "LogLevel": "None",
[2026-02-07T15:45:01.041Z]       "Filter": null
[2026-02-07T15:45:01.041Z]     },
[2026-02-07T15:45:01.041Z]     {
[2026-02-07T15:45:01.041Z]       "ProviderName": "Microsoft.Azure.WebJobs.Script.WebHost.Diagnostics.SystemLoggerProvider",
[2026-02-07T15:45:01.041Z]       "CategoryName": null,
[2026-02-07T15:45:01.041Z]       "LogLevel": null,
[2026-02-07T15:45:01.041Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.041Z]     },
[2026-02-07T15:45:01.041Z]     {
[2026-02-07T15:45:01.041Z]       "ProviderName": "Azure.Functions.Cli.Diagnostics.ColoredConsoleLoggerProvider",
[2026-02-07T15:45:01.041Z]       "CategoryName": null,
[2026-02-07T15:45:01.041Z]       "LogLevel": null,
[2026-02-07T15:45:01.041Z]       "Filter": "<AddFilter>b__0"
[2026-02-07T15:45:01.041Z]     }
[2026-02-07T15:45:01.041Z]   ]
[2026-02-07T15:45:01.041Z] }
[2026-02-07T15:45:01.041Z] HttpWorkerOptions
[2026-02-07T15:45:01.041Z] {
[2026-02-07T15:45:01.041Z]   "Type": 0,
[2026-02-07T15:45:01.041Z]   "Description": null,
[2026-02-07T15:45:01.041Z]   "Arguments": null,
[2026-02-07T15:45:01.041Z]   "Port": 46223,
[2026-02-07T15:45:01.041Z]   "IsPortManuallySet": false,
[2026-02-07T15:45:01.041Z]   "EnableForwardingHttpRequest": false,
[2026-02-07T15:45:01.041Z]   "EnableProxyingHttpRequest": false,
[2026-02-07T15:45:01.041Z]   "InitializationTimeout": "00:00:30",
[2026-02-07T15:45:01.041Z]   "CustomRoutesEnabled": false,
[2026-02-07T15:45:01.041Z]   "Http": null
[2026-02-07T15:45:01.041Z] }
[2026-02-07T15:45:01.041Z] FunctionResultAggregatorOptions
[2026-02-07T15:45:01.041Z] {
[2026-02-07T15:45:01.041Z]   "BatchSize": 1000,
[2026-02-07T15:45:01.041Z]   "FlushTimeout": "00:00:30",
[2026-02-07T15:45:01.041Z]   "IsEnabled": true
[2026-02-07T15:45:01.041Z] }
[2026-02-07T15:45:01.041Z] ConcurrencyOptions
[2026-02-07T15:45:01.042Z] {
[2026-02-07T15:45:01.042Z]   "DynamicConcurrencyEnabled": false,
[2026-02-07T15:45:01.042Z]   "MaximumFunctionConcurrency": 500,
[2026-02-07T15:45:01.042Z]   "CPUThreshold": 0.8,
[2026-02-07T15:45:01.042Z]   "SnapshotPersistenceEnabled": true
[2026-02-07T15:45:01.042Z] }
[2026-02-07T15:45:01.042Z] SingletonOptions
[2026-02-07T15:45:01.042Z] {
[2026-02-07T15:45:01.042Z]   "LockPeriod": "00:00:15",
[2026-02-07T15:45:01.042Z]   "ListenerLockPeriod": "00:00:15",
[2026-02-07T15:45:01.042Z]   "LockAcquisitionTimeout": "10675199.02:48:05.4775807",
[2026-02-07T15:45:01.042Z]   "LockAcquisitionPollingInterval": "00:00:05",
[2026-02-07T15:45:01.042Z]   "ListenerLockRecoveryPollingInterval": "00:01:00"
[2026-02-07T15:45:01.042Z] }
[2026-02-07T15:45:01.042Z] ScaleOptions
[2026-02-07T15:45:01.042Z] {
[2026-02-07T15:45:01.042Z]   "ScaleMetricsMaxAge": "00:02:00",
[2026-02-07T15:45:01.042Z]   "ScaleMetricsSampleInterval": "00:00:10",
[2026-02-07T15:45:01.042Z]   "MetricsPurgeEnabled": true,
[2026-02-07T15:45:01.042Z]   "IsTargetScalingEnabled": true,
[2026-02-07T15:45:01.042Z]   "IsRuntimeScalingEnabled": false
[2026-02-07T15:45:01.042Z] }
[2026-02-07T15:45:01.043Z] Starting JobHost
[2026-02-07T15:45:01.045Z] Starting Host (HostId=bess-951255543, InstanceId=20d7e0de-5011-4517-bf7f-3202b71029a4, Version=4.1045.200.25556, ProcessId=15497, AppDomainId=1, InDebugMode=False, InDiagnosticMode=False, FunctionsExtensionVersion=(null))
[2026-02-07T15:45:01.071Z] Worker process started and initialized.
[2026-02-07T15:45:01.071Z] Generating 5 job function(s)
[2026-02-07T15:45:01.104Z] Found the following functions:
[2026-02-07T15:45:01.104Z] Host.Functions.Double
[2026-02-07T15:45:01.104Z] Host.Functions.RenderOAuth2Redirect
[2026-02-07T15:45:01.104Z] Host.Functions.RenderOpenApiDocument
[2026-02-07T15:45:01.104Z] Host.Functions.RenderSwaggerDocument
[2026-02-07T15:45:01.104Z] Host.Functions.RenderSwaggerUI
[2026-02-07T15:45:01.104Z] 
[2026-02-07T15:45:01.109Z] HttpOptions
[2026-02-07T15:45:01.109Z] {
[2026-02-07T15:45:01.109Z]   "DynamicThrottlesEnabled": false,
[2026-02-07T15:45:01.109Z]   "EnableChunkedRequestBinding": false,
[2026-02-07T15:45:01.109Z]   "MaxConcurrentRequests": -1,
[2026-02-07T15:45:01.109Z]   "MaxOutstandingRequests": -1,
[2026-02-07T15:45:01.109Z]   "RoutePrefix": "api"
[2026-02-07T15:45:01.109Z] }
[2026-02-07T15:45:01.110Z] Initializing function HTTP routes
[2026-02-07T15:45:01.110Z] Mapped function route 'api/Double' [post] to 'Double'
[2026-02-07T15:45:01.110Z] Mapped function route 'api/oauth2-redirect.html' [GET] to 'RenderOAuth2Redirect'
[2026-02-07T15:45:01.110Z] Mapped function route 'api/openapi/{version}.{extension}' [GET] to 'RenderOpenApiDocument'
[2026-02-07T15:45:01.110Z] Mapped function route 'api/swagger.{extension}' [GET] to 'RenderSwaggerDocument'
[2026-02-07T15:45:01.110Z] Mapped function route 'api/swagger/ui' [GET] to 'RenderSwaggerUI'
[2026-02-07T15:45:01.110Z] 
[2026-02-07T15:45:01.114Z] Host initialized (64ms)
[2026-02-07T15:45:01.116Z] Host started (69ms)
[2026-02-07T15:45:01.116Z] Job host started

Functions:

	Double: [POST] http://localhost:7071/api/Double

	RenderOAuth2Redirect: [GET] http://localhost:7071/api/oauth2-redirect.html

	RenderOpenApiDocument: [GET] http://localhost:7071/api/openapi/{version}.{extension}

	RenderSwaggerDocument: [GET] http://localhost:7071/api/swagger.{extension}

	RenderSwaggerUI: [GET] http://localhost:7071/api/swagger/ui

[2026-02-07T15:45:06.044Z] Host lock lease acquired by instance ID '0000000000000000000000000172327A'.

```

Capture network activity using `strace -f -tt -o /tmp/func.trace func start --verbose --no-build`

```
8442:24846 16:02:32.604355 sendto(113, [{nlmsg_len=20, nlmsg_type=RTM_GETLINK, nlmsg_flags=NLM_F_REQUEST|NLM_F_DUMP, nlmsg_seq=1770480152, nlmsg_pid=0}, {ifi_family=AF_UNSPEC, ...}], 20, 0, {sa_family=AF_NETLINK, nl_pid=0, nl_groups=00000000}, 12 <unfinished ...>
8462:24846 16:02:32.604771 sendto(113, [{nlmsg_len=20, nlmsg_type=RTM_GETADDR, nlmsg_flags=NLM_F_REQUEST|NLM_F_DUMP, nlmsg_seq=1770480153, nlmsg_pid=0}, {ifa_family=AF_UNSPEC, ...}], 20, 0, {sa_family=AF_NETLINK, nl_pid=0, nl_groups=00000000}, 12) = 20
11949:24843 16:02:32.656375 connect(155, {sa_family=AF_UNIX, sun_path="/var/run/nscd/socket"}, 110 <unfinished ...>
11975:24843 16:02:32.656519 connect(155, {sa_family=AF_UNIX, sun_path="/var/run/nscd/socket"}, 110 <unfinished ...>
12290:24843 16:02:32.658473 connect(155, {sa_family=AF_INET, sin_port=htons(53), sin_addr=inet_addr("127.0.0.53")}, 16) = 0
12729:24843 16:02:32.670271 recvfrom(155, "\347d\201\200\0\1\0\t\0\0\0\1\2dc\10services\fvisuals"..., 2048, 0, {sa_family=AF_INET, sin_port=htons(53), sin_addr=inet_addr("127.0.0.53")}, [28 => 16]) = 423
12836:24843 16:02:32.681959 recvfrom(155, "6g\201\200\0\1\0\10\0\1\0\1\2dc\10services\fvisuals"..., 65536, 0, {sa_family=AF_INET, sin_port=htons(53), sin_addr=inet_addr("127.0.0.53")}, [28 => 16]) = 468
12915:24843 16:02:32.683946 connect(145, {sa_family=AF_INET6, sin6_port=htons(443), sin6_flowinfo=htonl(0), inet_pton(AF_INET6, "::ffff:20.50.88.238", &sin6_addr), sin6_scope_id=0}, 28) = -1 EINPROGRESS (Operation now in progress)
14336:24843 16:02:32.716691 sendto(145, "\26\3\1\6\0\1\0\5\374\3\3\333\207\242\341$\370\27\32Hw'\202vY\7\217\305\367\203\335\377"..., 1541, 0, NULL, 0) = 1541
14396:24843 16:02:32.717945 recvfrom(145, 0x798afbffd290, 1, MSG_PEEK, NULL, NULL) = -1 EAGAIN (Resource temporarily unavailable)
```