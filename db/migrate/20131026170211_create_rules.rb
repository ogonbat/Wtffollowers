class CreateRules < ActiveRecord::Migration
  def change
    create_table :rules do |t|
      t.string :type
      t.string :icon
      t.string :method
      t.string :action
      t.string :discount
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end
