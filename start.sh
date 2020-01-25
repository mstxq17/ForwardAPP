#!/bin/bash
cd /opt/confd/bin
confd -watch -backend etcd -node http://app:2379
nginx -g 'daemon off;'