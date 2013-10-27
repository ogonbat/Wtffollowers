class Provider < ActiveRecord::Base
  acts_as_api
  belongs_to :user

  api_accessible :public do |template|
    template.add :uid
    template.add :provider
    template.add :token
    template.add :nickname
  end
end
