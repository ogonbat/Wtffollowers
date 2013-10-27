class Admin::RulesController < ApplicationController
  before_action :set_rule, only: [:show, :edit, :update, :destroy]
  before_filter :authenticate_user!
  # GET /rules
  # GET /rules.json
  def index
    @rules = Rule.all
    render_for_api :public, :json => @rules
  end

  # GET /check
  def check
    #before we need to get the the rules
    @rules = Rule.where :user => current_user
    puts params
    if params[:customer_id]
      puts params
      customer = User.find(params[:customer_id])
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
      render json: {result: true, data: final_rule}
    else
      render json: {result: false}
    end
  end
  # GET /rules/1
  # GET /rules/1.json
  def show
    render json: @rule
  end

  # GET /rules/new
  def new
    @rule = Rule.new
  end

  # GET /rules/1/edit
  def edit
  end

  # POST /rules
  # POST /rules.json
  def create
    @rule = Rule.new()
    @rule.what = rule_params[:what]
    @rule.discount = rule_params[:discount]
    @rule.icon = rule_params[:icon]
    @rule.method = rule_params[:method]
    @rule.api_services = rule_params[:api_services]
    @rule.user = current_user
    @rule.save()
    render json: @rule, status: :created
  end

  # PATCH/PUT /rules/1
  # PATCH/PUT /rules/1.json
  def update
    respond_to do |format|
      if @rule.update(rule_params)
        format.html { redirect_to @rule, notice: 'Rule was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @rule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rules/1
  # DELETE /rules/1.json
  def destroy
    @rule.destroy
    render json: {}

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rule
      @rule = Rule.find_by id: params[:id], user: current_user
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rule_params
      params.permit(:api_services, :icon, :method, :what, :discount, :user_id)
    end
end
