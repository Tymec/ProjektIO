"""Test hello_world.py"""
from app.hello_world import HelloWorld


def test_hello_world(capfd):
    HelloWorld()
    out, _ = capfd.readouterr()
    assert out == "Hello world!\n"
