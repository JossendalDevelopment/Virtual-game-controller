"""
This is to define the project so that it's packages can be installed.

https://docs.python.org/3.8/distutils/setupscript.html
"""

from distutils.core import setup

setup(name='app-server',
      version='1.0',
      description='Virtual Game Controller',
      author='Kevin Jossendal',
      author_email='kjossendal@gmail.com',
      url='https://github.com/JossendalDevelopment/Virtual-game-controller',
      packages=['server'],
      )