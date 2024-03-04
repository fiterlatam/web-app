#!/bin/bash
echo "---
- name: 'Continuos deployment to Mifos service'
  hosts: managerdevdb
  become: yes
  become_method: runas
  become_flags: logon_type=new_credentials logon_flags=netcredentials_only
  vars:
    ansible_become_user: 'ansible'
    ansible_become_pass: '4Ns1BL3-4DM1N**'
  tasks:
    - name: Copy docker-compose file to set up the Mifos service
      copy:
        src: ./$3
        dest: /home/ansible

    - name: Start up the mifos service
      shell: 'docker compose -f $3 up -d $4'

    - name: Delete the old image
      shell: docker rmi $1
" > $2