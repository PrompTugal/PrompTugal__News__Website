#!/usr/bin/env python3
"""Mints, with observability@'s own library (newsroom/tools/obs/claims_lib.py), a pool, a licence and its lookup, signed by a
throwaway issuer, and prints them as JSON for test_onboard_interop.mjs to check in the browser's code. No sgit_ai needed."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../tools/obs'))
import claims_lib as L
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
priv = ec.generate_private_key(ec.SECP256R1())
pem = priv.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()
fp = L.fingerprint(priv.public_key())
key = L.new_api_key()
lookup, file_obj = L.make_licence(key, 'pilot-token-for-interop', 'pilot-test', priv, fp)
pool = L.sign_obj(priv, {'v': 1, 'kind': 'pool', 'updated': L.now(), 'entries': [{'api_key': key, 'added': L.now()}]}, fp)
msg = L.sign_obj(priv, {'v': 1, 'kind': 'welcome', 'n': 1, 'body': {}, 'at': L.now()}, fp)
print(json.dumps({'issuer': {'fingerprint': fp, 'sign': pem}, 'api_key': key, 'lookup': lookup, 'licence_file': file_obj, 'pool': pool, 'message_inner': msg}))
