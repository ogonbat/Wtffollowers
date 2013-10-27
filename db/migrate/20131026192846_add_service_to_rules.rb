class AddServiceToRules < ActiveRecord::Migration
  def change
    add_column :rules, :api_services, :string
  end
end
