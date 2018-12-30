Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  match "/404", :to => "error#not_found", :via => :all
  post '/subscribe', to: 'pages#subscribe'
  get "/", to: 'pages#splash'
  # get "/*all", to: 'pages#splash'
end
