class CreateTokens < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.belongs_to :user, index: true
      t.string :token

      t.timestamps
    end
  end
end
