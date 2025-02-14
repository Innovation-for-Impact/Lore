# Lore Backend

## Technologies

**Django and Python**

We will be using Python with Django for the backend and PostgreSQL for the database. If
you have not used Django before, you should follow [this quickstart guide](https://docs.djangoproject.com/en/5.1/)
in a separate directory (i.e. don't do this in the Lore repository).

**PostgreSQL**

We will interact with PostgreSQL through [Django's interface](https://docs.djangoproject.com/en/5.1/topics/db/queries/).
In other words, you most likely wont need to use PostgreSQL's interface. However,
Django does support raw SQL Queries

## Clone the repository

If you don't have an SSH key setup with Github, follow the [EECS 280 Guide](https://eecs280staff.github.io/tutorials/setup_git.html).

Once you have that setup, clone the repository `$ git clone git@github.com:Innovation-for-Impact/Lore.git` if you have not done so already.

## Development Environment Setup

### Install Python

**MacOS:**

```bash
$ brew install python@3.12
$ python3 --version
3.12.3
```

**Linux:**

```bash
$ sudo apt update
$ sudo apt install python3
$ python3 --version
3.12.3
```

### Running a Python Virtual Environment

If none of the `python` commands work, replace with `python3`.

**Create the Python virtual environment:**

Make sure you are in the backend folder when you create the virtual environment.

```bash
$ pwd
/Lore/back_end
$ python3 -m venv env/
```

**Activate virtual environment:**

```bash
source env/bin/activate
```

**Note:** Activating may differ based on your shell. See
[docs](https://docs.python.org/3/library/venv.html#how-venvs-work).
You will always need to activate your virtual environment before you begin development.

**Install necessary packages:**

```bash
pip install -r requirements.txt
```

**Note:** This may take a while.

### Initialize PostgreSQL Databse

**Brew**

```bash
brew install postgresql postgresql-contrib
brew install libpq-dev python3-dev
```

**Linux**

```bash
sudo apt-get install postgresql postgresql-contrib
sudo apt-get install libpq-dev python3-dev
```

Now run the following Bash script:

```bash
./bin/init_test_db
```

This will initialize a debug PostgreSQL database and migrate the Django SQL Database

### Create a Super User

An admin account is useful for debugging. To create one,

```bash
python3 manage.py createsuperuser
```

This also verifies that your database is setup correctly.

### Running the Python Backend

```bash
python3 manage.py runserver
```

The server is now hosted on [http://localhost:8000](http://localhost:8000). To change the port the server is specified on, you can do:

```bash
python3 manage.py runserver <IP:PORT>
```

For example, `<IP:PORT>=0.0.0.0:8080`, runs the server at IP `0.0.0.0` and port `8080`.

**Deactivate the virtual environment:**

```bash
deactivate
```

**Note:** the virtual environment needs to be activated when running the backend server

Creates an admin account. Follow the prompts and then go to `localhost:8000/admin/` and log in with the credentials.

## Testing

Testing is an important part of creating any piece of software, and Innofunds is no different. You should write
test cases for the code that you write. To write test cases, you can take advantage of Django's built in testing suite.

Running tests. You can run tests with `$ python manage.py test`. For more advanced functionality, see
[here](https://docs.djangoproject.com/en/5.1/topics/testing/overview/#running-tests).

### Model and General Testing

For testing models and other general functions, see [this](https://docs.djangoproject.com/en/5.1/topics/testing/overview/) guide by Django.
You can also find some examples in the `tests.py` file, where these tests should be written.

### Django Rest Framework Testing

See this [guide](https://www.django-rest-framework.org/api-guide/testing/). API tests should, again, be written in `tests.py`.

Additional resource for examples [here](https://dev.to/alchermd/what-to-test-in-django-endpoints-357n)

### Django Endpoint Testing

For testing general purpose endpoints (that are not DRF), see
[this](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Testing#views) guide

## API

### Admin Users: `/admin/users/`

Admin only. Supports all operations. **UNSTABLE: MAY CHANGE IN THE FUTURE**

### Authentication: `api/v1/auth/...`

This is the authentication input. All specifications are [here](https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html) with some minor exceptions given below:

- `rest_auth` is replaced simply with `auth`.
- The application just uses email, **NOT** usernames.
- Registration takes in `first_name` and `last_name`.
- There is a password reset confirmation URL (that **isn't** specified in the linked specification) that will server a _static_ HTML page provided by the backend. I.e. the frontend need not do anything with this endpoint.

## Conclusion

If anything about this document is unclear, please make an issue on Github or bring it up in the Slack.

## Additional Resources

- <https://pypi.org/project/django-cors-headers/>

- <https://docs.djangoproject.com/en/5.1/ref/databases/#postgresql-notes>

- <https://docs.allauth.org/en/latest/installation/quickstart.html>

- <https://dj-rest-auth.readthedocs.io/en/latest/index.html>

- <https://www.django-rest-framework.org/>
