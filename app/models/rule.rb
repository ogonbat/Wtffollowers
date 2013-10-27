class Rule < ActiveRecord::Base
  acts_as_api
  belongs_to :user

  api_accessible :public do |template|
    template.add :id
    template.add :api_services
    template.add :icon
    template.add :method
    template.add :what
    template.add :discount
  end
end
