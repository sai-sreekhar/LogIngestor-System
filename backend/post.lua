-- Define variables to count successful and failed responses
local successfulResponses = 0
local failedResponses = 0

-- function init(args)
-- end

-- function request()
--     return wrk.format(wrk.method, nil, wrk.headers, wrk.body)
-- end

function response(status, headers, body)
    if status == 200 or status == 201 or status == 204 or status == 301 or status == 302 or status == 304 then
        successfulResponses = successfulResponses + 1
    else
        failedResponses = failedResponses + 1

        print(string.format("Received non-successful response: %d", status))
        print("Headers:")
        for k, v in pairs(headers) do
            print(string.format("%s: %s", k, v))
        end
        print("Body:")
        print(body)
    end
    -- Your other response handling logic here if needed
end

function done(summary, latency, requests)
    print(string.format("Number of successful responses: %d", successfulResponses))
    print(string.format("Number of failed responses: %d", failedResponses))
    -- Your other done logic here
end

-- Define the wrk configuration
wrk.method  = "POST"
wrk.headers = {
    ["Content-Type"] = "application/json",
}
wrk.body    = '{"level": "Testing12","message": "Performance Testing","resourceId": "server-9876","timestamp": "2023-11-20T10:00:00Z","traceId": "abc-xyz-162","spanId": "span-238","commit": "5a5257g","metadata": {"parentResourceId": "server-2387"}}'
