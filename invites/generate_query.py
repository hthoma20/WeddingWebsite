with open('invites.csv', 'r') as csv_file, open('query.txt', 'w') as query_file:
    
    is_header= True
    for entry in csv_file:
        if is_header:
            is_header= False
            continue
  
        split_entry= entry.split(',')
        
        split_entry[5]= split_entry[5][:-1]
    
        query= "insert into Invitation (is_guest, first_name, last_name, group_id, ceremony, reception) values ({},'{}','{}',{},{},{});".format(*split_entry)
                
        query_file.write('{}\n'.format(query))