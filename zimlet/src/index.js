//Load components from Zimbra
import { createElement } from "preact";
import { withIntl } from "./enhancers";
import { MenuItem } from "@zimbra-client/components";

//Load the App component from our Zimlet
import App from "./components/app";

//Load a style static stylesheet (Preact will not change this)
import './public/styles.css';

//Create function by Zimbra convention
export default function Zimlet(context) {
	//Get the 'plugins' object from context and define it in the current scope
	const { plugins } = context;
	const exports = {};
	const userCOS = context.getAccount().cos.id;
	const userDomain = context.getAccount().name.substring(context.getAccount().name.lastIndexOf("@") + 1);
	const zimlets = context.getAccount().zimlets
	let zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-anyframe");
	let globalConfig = new Map();

	//load demo configuration when running from Sideloader
	if (!zimlet) {
		zimlets.zimlet.push(
			{
				"__typename": "AccountZimletInfo",
				"zimletContext": null,
				"zimlet": [
					{
						"__typename": "AccountZimletDesc",
						"name": "zimbra-zimlet-anyframe",
						"label": null,
						"zimbraXZimletCompatibleSemVer": null,
						"description": null
					}
				],
				"zimletConfig": [
					{
						"__typename": "AccountZimletConfigInfo",
						"global": [
							{
								"__typename": "ZimletConfigGlobal",
								"property": [
									{
										"__typename": "ZimletConfigProperty",
										"name": "tab1",
										"content": "{'url':'https://embed.windy.com/?52.032,4.310,11','icon':'https://www.windy.com/favicon.ico','name':'Windy.com','route':'/integrations/','allowDomains':'', 'allowCOSID':''}"
									},
									{
										"__typename": "ZimletConfigProperty",
										"name": "tab2",
										"content": "{'url':'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46800.96020851833!2d-78.87109739351685!3d42.85046597320593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d31234c99a4875%3A0x57bea679387ecece!2sSynacor%2C%20Inc.!5e0!3m2!1sen!2snl!4v1648024277172!5m2!1sen!2snl','icon':'https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico','name':'Synacor Office','route':'/chatapps/','allowDomains':'', 'allowCOSID':''}"
									},
									{
										"__typename": "ZimletConfigProperty",
										"name": "tab3",
										"content": "{'url':'https://blog.zimbra.com/','icon':'https://www.zimbra.com/wp-content/uploads/2023/07/cropped-favicon-32x32.png','name':'Zimbra Blog','route':'/cloudapps/','allowDomains':'', 'allowCOSID':''}"
									}
								]
							}
						],
						"host": null,
						"property": null,
						"name": "zimbra-zimlet-anyframe",
						"version": null
					}
				]
			});
		zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-anyframe");
	}
	if (zimlet) {
		const config = zimlet.zimletConfig[0].global[0].property || [];
		for (let i = 0; i < config.length; i++) {
			globalConfig.set(config[i].name, config[i].content);
		};
	}

	/*console.log("AnyFrame Zimlet config:");
	console.log(globalConfig);
	console.log("AnyFrame Zimlet tab1 config:");
	console.log(globalConfig.get("tab1").replaceAll('\'', '"'));
	console.log("AnyFrame Zimlet tab2 config:");
	console.log(globalConfig.get("tab2").replaceAll('\'', '"'));
	console.log("AnyFrame Zimlet tab3 config:");
	console.log(globalConfig.get("tab3").replaceAll('\'', '"'));*/

	let tab1 = false; try { tab1 = JSON.parse(globalConfig.get("tab1").replaceAll('\'', '"')); } catch (err) { tab1 = false; console.log("AnyFrame Zimlet Error getting tab1 JSON: "); console.log(err)}
	let tab2 = false; try { tab2 = JSON.parse(globalConfig.get("tab2").replaceAll('\'', '"')); } catch (err) { tab2 = false; console.log("AnyFrame Zimlet Error getting tab2 JSON: "); console.log(err)}
	let tab3 = false; try { tab3 = JSON.parse(globalConfig.get("tab3").replaceAll('\'', '"')); } catch (err) { tab3 = false; console.log("AnyFrame Zimlet Error getting tab3 JSON: "); console.log(err)}

	/*console.log("AnyFrame Zimlet tab1 JSON:");
	console.log(tab1);
	console.log("AnyFrame Zimlet tab2 JSON:");
	console.log(tab2);
	console.log("AnyFrame Zimlet tab3 JSON:");
	console.log(tab3);*/

	//permissions
	//in case allowDomains is set: only show tab if the user's domain is listed in allowDomains
	if (tab1 && tab1.allowDomains !== '') {
		if (!tab1.allowDomains.includes(userDomain))
			tab1 = false;
	}
	if (tab2 && tab2.allowDomains !== '') {
		if (!tab2.allowDomains.includes(userDomain))
			tab2 = false;
	}
	if (tab3 && tab3.allowDomains !== '') {
		if (!tab3.allowDomains.includes(userDomain))
			tab3 = false;
	}

	if (tab1 && tab1.allowCOSID !== '') {
		if (!tab1.allowCOSID.includes(userCOS))
			tab1 = false;
	}
	if (tab2 && tab2.allowCOSID !== '') {
		if (!tab2.allowCOSID.includes(userCOS))
			tab2 = false;
	}
	if (tab3 && tab3.allowCOSID !== '') {
		if (!tab3.allowCOSID.includes(userCOS))
			tab3 = false;
	}


	/*console.log("AnyFrame Zimlet after rights applied tab1:");
	console.log(tab1);
	console.log("AnyFrame Zimlet after rights applied tab2:");
	console.log(tab2);
	console.log("AnyFrame Zimlet after rights applied tab3:");
	console.log(tab3);*/

	function router1() {
		return [<App path={tab1.route + `tab1`}>{tab1}</App>];
	}
	function router2() {
		return [<App path={tab2.route + `tab2`}>{tab2}</App>];
	}
	function router3() {
		return [<App path={tab3.route + `tab3`}>{tab3}</App>];
	}

	exports.init = function init() {
		if (tab1) {
			const style1 = "background: url('" + tab1.icon + "') no-repeat left center; background-size: 20px 20px;";
			const tab1menu = withIntl()(() => (
				<MenuItem responsive href={tab1.route + `tab1`}>
					<span className="anyFrameIcon" style={style1}></span><b>
						{tab1.name}</b>
				</MenuItem>
			));

			switch (tab1.route) {
				case '/briefcase/':
					plugins.register("slot::briefcase-tab-item", tab1menu);
					break;
				case '/calendar/':
					plugins.register("slot::calendar-tab-item", tab1menu);
					break;
				case '/contacts/':
					plugins.register("slot::contacts-tab-item", tab1menu);
					break;
				case '/chatapps/':
					plugins.register('slot::chatapps-tab-item', tab1menu);
					break;
				case '/cloudapps/':
					plugins.register('slot::cloudapps-tab-item', tab1menu);
					break;
				case '/email/':
					plugins.register("slot::email-tab-item", tab1menu);
					break;
				case '/integrations/':
					plugins.register("slot::integrations-tab-item", tab1menu);
					break;
			}
			plugins.register("slot::routes", router1);
		}
		if (tab2) {
			const style2 = "background: url('" + tab2.icon + "') no-repeat left center; background-size: 20px 20px;";
			const tab2menu = withIntl()(() => (
				<MenuItem responsive href={tab2.route + `tab2`}>
					<span className="anyFrameIcon" style={style2}></span><b>
						{tab2.name}</b>
				</MenuItem>
			));
			switch (tab2.route) {
				case '/briefcase/':
					plugins.register("slot::briefcase-tab-item", tab2menu);
					break;
				case '/calendar/':
					plugins.register("slot::calendar-tab-item", tab2menu);
					break;
				case '/contacts/':
					plugins.register("slot::contacts-tab-item", tab2menu);
					break;
				case '/chatapps/':
					plugins.register('slot::chatapps-tab-item', tab2menu);
					break;
				case '/cloudapps/':
					plugins.register('slot::cloudapps-tab-item', tab2menu);
					break;
				case '/email/':
					plugins.register("slot::email-tab-item", tab2menu);
					break;
				case '/integrations/':
					plugins.register("slot::integrations-tab-item", tab2menu);
					break;			}
			plugins.register("slot::routes", router2);
		}
		if (tab3) {
			const style3 = "background: url('" + tab3.icon + "') no-repeat left center; background-size: 20px 20px;";
			const tab3menu = withIntl()(() => (
				<MenuItem responsive href={tab3.route + `tab3`}>
					<span className="anyFrameIcon" style={style3}></span><b>
						{tab3.name}</b>
				</MenuItem>
			));
			switch (tab3.route) {
				case '/briefcase/':
					plugins.register("slot::briefcase-tab-item", tab3menu);
					break;
				case '/calendar/':
					plugins.register("slot::calendar-tab-item", tab3menu);
					break;
				case '/contacts/':
					plugins.register("slot::contacts-tab-item", tab3menu);
					break;
				case '/chatapps/':
					plugins.register('slot::chatapps-tab-item', tab3menu);
					break;
				case '/cloudapps/':
					plugins.register('slot::cloudapps-tab-item', tab3menu);
					break;
				case '/email/':
					plugins.register("slot::email-tab-item", tab3menu);
					break;
				case '/integrations/':
					plugins.register("slot::integrations-tab-item", tab3menu);
					break;
			}
			plugins.register("slot::routes", router3);
		}
	};

	return exports;
}
