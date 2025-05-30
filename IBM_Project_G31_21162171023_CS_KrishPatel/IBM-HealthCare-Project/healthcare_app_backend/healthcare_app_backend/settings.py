"""
Django settings for healthcare_app_backend project.

Generated by 'django-admin startproject' using Django 4.2.18.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-qq7+m2d$p_bdtse0*!=nik^+vd$8&wes(_ud2z29y8_k@_2rwa"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'Doctor.apps.DoctorConfig',  # Make sure Doctor app is first due to dependencies
    'user_management',
    'hospital',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = "healthcare_app_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "healthcare_app_backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'Healthcare',
#         'USER': 'postgres',
#         'PASSWORD': 'yash1009',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Demo',
        'USER': 'postgres',
        'PASSWORD': 'krish1023',
        'HOST': 'localhost',
        'PORT': '5432',
        }
    }


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }


# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'Healthcare2',
#         'CLIENT': {
#             'host': 'localhost',
#             'port': 27017,
#         }
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
        
#         'NAME': 'Healthcare',
#         'CLIENT': {
#             'host': 'mongodb://localhost:27017/', # Replace with your MongoDB server address
#             'port': 27017,               # Replace with your MongoDB port if different
#             # 'username': 'Krishspatel06', # Replace with your MongoDB username (optional)
#             # 'password': 'IBMhealthcare@0605', # Replace with your MongoDB password (optional)
#             'authSource': 'admin',
#             # 'authMechanism': 'SCRAM-SHA-1',
#         },
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

DEBUG = True

DJONGO_USE_NATIVE_JSONFIELD = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

AUTH_USER_MODEL = 'user_management.User'# Update this to your custom user model

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
FRONTEND_URL = 'http://localhost:3000'

SIMPLE_JWT = {
    "ALGORITHM": "HS256",
}

SECRET_KEY = 'x&6yrtrk@!^dp$16zm(!vpaw76genoe%$@@q)vbrz2=h01po$w'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'         # Replace with your SMTP host
EMAIL_PORT = 587                        # SMTP port, e.g., 587 for TLS
EMAIL_USE_TLS = True                    # Use TLS if required by your provider
EMAIL_HOST_USER = 'healthcare.project1224@gmail.com'  # Your email username
EMAIL_HOST_PASSWORD = 'kpjgiqmdqbttiqxt'         # Your email password
DEFAULT_FROM_EMAIL = 'noreply@example.com'

CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

RECAPTCHA_SECRET_KEY = '6LftjRcrAAAAAMzzz5Mj2AMpGmHhYwUoswKQlvv2'

# Cache settings
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,  # 5 minutes default timeout
        'OPTIONS': {
            'MAX_ENTRIES': 1000,  # Maximum number of entries in cache
            'CULL_FREQUENCY': 3,  # Fraction of entries to cull when max is reached
        }
    }
}

# import logging

# logging.basicConfig(
#     level=logging.DEBUG,
#     format='%(asctime)s %(levelname)s %(message)s',
# )


