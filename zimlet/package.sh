#!/bin/bash

npm install
zimlet build
zimlet package -v 0.0.4 --zimbraXVersion ">=2.0.0" -n "zimbra-zimlet-anyframe" --desc "Show websites as a tab in Zimbra Modern UI." -l "Iframe integrations"
