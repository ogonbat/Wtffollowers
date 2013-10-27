class Admin::ScannerController < ApplicationController
  before_filter :authenticate_user!
  def index
    my_file = convert_from_base64(params[:params][:photo])
    resultZbar = ZBar::Image.from_jpeg(my_file).process
    begin
      render json: {result: true, code: resultZbar[0].data}
    rescue NoMethodError => e
      render json: {result: false}
    end
  end

  private
  def convert_from_base64(image_data)
    data_index = image_data.index('base64') + 7
    file_data = image_data.slice(data_index, image_data.length)
    Base64.decode64(file_data)
  end
end
