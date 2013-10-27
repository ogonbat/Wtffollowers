class AddColumnWhat < ActiveRecord::Migration
  def change
    add_column :rules, :what, :string
  end
end
