json.array!(@rules) do |rule|
  json.extract! rule, :type, :icon, :method, :action, :discount, :user_id
  json.url rule_url(rule, format: :json)
end
