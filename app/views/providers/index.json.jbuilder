json.array!(@providers) do |provider|
  json.extract! provider, :provider, :uid, :nickname, :token, :secret
  json.url provider_url(provider, format: :json)
end
