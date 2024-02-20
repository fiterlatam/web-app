#!/bin/bash
echo "---
- name: 'Continuos delivery os Mifos deployment'
  hosts: managerdev
  become: yes
  become_method: runas
  become_flags: logon_type=new_credentials logon_flags=netcredentials_only
  vars:
    ansible_become_user: 'ansible'
    ansible_become_pass: '4Ns1BL3-4DM1N**'
  tasks:
    - name: Copy mifos/deployment.frontend.yaml file to set up the Mifos deployment
      copy:
        src: ./deployment.frontend.yaml
        dest: /home/ansible

    - name: Apply the mifos/deployment.frontend.yaml k8s manifest
      shell: 'kubectl apply -f deployment.frontend.yaml'

" > deploy-mifos-frontend-deployment-playbook.yaml