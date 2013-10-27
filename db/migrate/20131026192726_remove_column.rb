class RemoveColumn < ActiveRecord::Migration
  def change
    remove_column :rules, :type
  end
end
