from django.urls import path , include
from django.conf import settings
from User.views import *
from django.conf.urls.static import static
from User.team_views import *
urlpatterns = [
        path('create_user/',CreateUserView),
        path("get_user/<str:phone>/<str:role>",GetUserByRoleView),
        path('EditProfile/<str:phone>/',EditProfileView.as_view()),
        path('Uplode_Profile/<str:phone>/',Uplode_ProfilePic.as_view()),
        path('create_FMC/<str:phone>/',createFMC),

        path('verify_Team/',VerifyTeamView),
        path('edit_Team/',UpdateTeamView),


        
        
]+  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)