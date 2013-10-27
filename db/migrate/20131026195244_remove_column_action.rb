class RemoveColumnAction < ActiveRecord::Migration
  def change
    remove_column :rules, :action
  end
end
