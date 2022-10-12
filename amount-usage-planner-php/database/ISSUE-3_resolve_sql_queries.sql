SELECT COUNT(*) FROM amount WHERE MONTH = MONTHNAME(CURDATE()) AND YEAR = YEAR(CURDATE()) 

SELECT COUNT(*) `count` FROM amount WHERE `month` = 'November' AND `year` = 2022

SELECT MONTHNAME(CURDATE()), YEAR(CURDATE()) 

/* Get Planned PERCENTAGE for an Item */
SELECT amount.`id`, amount.`value`,`planned_percentage` FROM `save_plan`,`amount`
                          WHERE save_plan.`id` = 6 AND amount.`month` ='September' AND amount.`year` = 2022
                          
                          
SELECT am.month,ua.amount_id, sp.`id`, sp.`key_name`,sp.`planned_percentage`,
			  SUM(ua.`used_amount`) AS `used_amount`
			  , SUM(ua.`used_percentage`) AS `used_percentage`
			  , sp.`planned_percentage` - IF(SUM(ua.`used_percentage`), SUM(ua.`used_percentage`), 0) AS `remaining_percentage`
		      FROM save_plan sp
		      RIGHT JOIN used_amount ua ON ua.`key_id` = sp.`id`
		      LEFT JOIN amount am ON am.id = ua.`amount_id`
		      GROUP BY ua.amount_id, sp.id
		      ORDER BY ua.amount_id,sp.id