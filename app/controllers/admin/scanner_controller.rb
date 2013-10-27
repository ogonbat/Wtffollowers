class Admin::ScannerController < ApplicationController
  before_filter :authenticate_user!
  def index
    if not params[:params][:photo].blank?
      my_file = convert_from_base64(params[:params][:photo])
      resultZbar = ZBar::Image.from_jpeg(my_file).process
      begin
        @rules = Rule.where :user => current_user
        if resultZbar[0].data
          customer = User.find(resultZbar[0].data)
          final_rule = []

          @rules.each do |rule|
            if rule.api_services == "twitter"
              #we need to configure the store client and the customer client
              #get the store provider
              customer_provider = customer.providers.find_by :provider => "twitter"
              puts customer_provider.uid
              store_provider = current_user.providers.where(:provider => "twitter").first
              store_client = Twitter::REST::Client.new do |config|
                config.consumer_key        = "N88tBKaeDFxxgl1eCqECzg"
                config.consumer_secret     = "DimoMYgcqZhH8LULk7dyNziTEQbTUjuyVBPjLtE"
                config.access_token        = store_provider.token
                config.access_token_secret = store_provider.secret
              end

              if rule.method == "mention"
                #check if the customer has mentioned the user
                mentions = store_client.mentions_timeline
                mentions.each do |mention|
                  if mention.user.id == customer_provider.uid
                    final_rule.push(rule)
                    break
                  end
                end
              elsif rule.method == "hashtag"
                hashtags = store_client.search(rule.what).collect
                hashtags.each do |hashtag|
                  if hashtag.user.id == customer_provider.uid
                    final_rule.push(rule)
                    break
                  end
                end
              elsif rule.method == "follow"
                followers = store_client.followers
                followers.each do |follower|
                  if follower.id == customer_provider.uid
                    final_rule.push(rule)
                    break
                  end
                end
              end
            end
          end
          puts final_rule
          render json: {result: true, data: final_rule}
        else
          render json: {result: false}
        end
      rescue NoMethodError => e
        render json: {result: false}
      end
    end
    render json: {result: false}
  end

  private
  def convert_from_base64(image_data)
    data_index = image_data.index('base64') + 7
    file_data = image_data.slice(data_index, image_data.length)
    Base64.decode64(file_data)
  end
end
