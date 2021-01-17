# meal-plan


build the app:
`docker build -t mealplan_img .`

Using the application behind the jwilder/nginx-proxy and using https:
`docker run -d --name mealplan-app -e VIRTUAL_HOST=mealplan.craigattwood.co.uk -e LETSENCRYPT_HOST=mealplan.craigattwood.co.uk mealplan_img`

The additional parameters (-e) are for:
  VIRTUAL_HOST. to tell the nginx proxy how to direct the traffic.
  LETSENCRYPT_HOST. how to create the SSL Certs to what domain.


### How to use:
1. get the reverse proxy working: https://hub.docker.com/r/jwilder/nginx-proxy
2. Get the SSL service working in the background: https://github.com/nginx-proxy/docker-letsencrypt-nginx-proxy-companion
