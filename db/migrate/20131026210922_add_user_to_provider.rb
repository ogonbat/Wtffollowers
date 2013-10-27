class AddUserToProvider < ActiveRecord::Migration
  def change
    add_reference :providers, :user, index: true
  end
end
