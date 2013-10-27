class CreateProviders < ActiveRecord::Migration
  def change
    create_table :providers do |t|
      t.string :provider
      t.string :uid
      t.string :nickname
      t.string :token
      t.string :secret

      t.timestamps
    end
  end
end
