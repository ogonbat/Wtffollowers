class Mobile::HomeController < ApplicationController
  layout 'mobile'
  before_filter :authenticate_user!
  def index
  end

  def qrcode
    token_generate = (0...8).map { (65 + rand(26)).chr }.join


    api_uri = URI.parse('https://chart.googleapis.com')
    connection = Net::HTTP.new(api_uri.host, 443)
    connection.use_ssl = true
    connection.verify_mode = OpenSSL::SSL::VERIFY_NONE

    response = ""
    connection.start do |http|
      req = Net::HTTP::Get.new("/chart?cht=qr&chs=300x300&chl=#{current_user.id}")
      response = http.request(req)
    end
    puts response.body
    send_data response.body, :type => 'image/png',:disposition => 'inline'
  end
end
