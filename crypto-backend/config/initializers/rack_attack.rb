class Rack::Attack
    # Throttle requests to 100 requests per minute per IP
    throttle("req/ip", limit: 100, period: 1.minute) do |req|
        req.ip unless req.path == "/up"
    end

    throttle("search/ip", limit: 30, period: 1.minute) do |req|
        req.ip if req.path.include?("/coins/search")
    end
end       

# In config/application.rb you need:
# config.middleware.use Rack::Attack