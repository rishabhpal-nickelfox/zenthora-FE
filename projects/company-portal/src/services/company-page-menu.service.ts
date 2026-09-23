import {NbMenuItem} from '@nebular/theme';
import {Inject, Injectable} from "@angular/core";
import {UserManagementUiKeyService} from "./usermanagement/user-management-ui-key.service";
import {CompanyManagementUiKeyService} from "./companymanagement/company-management-ui-key.service";
import {AuditErrorsManagementUiKeyService} from "./auditerrorsmanagement/audit-errors-management-ui-key-service";
import {PlatformUiKeyService} from "./platform/platform-ui-key.service";
import {SaleUiKeyService} from "./sale/sale-ui-key.service";
import {VaultErrorsUiKeyService} from "./vaulterrors/vault-errors-ui-key.service";
import {SendgridSyncUiKeyService} from "./sendgrid/sendgrid-sync-ui-key.service";
import {EmailUiKeyService} from "./email/email-ui-key.service";
import {WebhookUiKeyService} from "./webhook/webhook-ui-key.service";
import {BasePageMenuService} from "../../../common/src/lib/utils/base-page-menu.service";
import {CompanyPortalPagePath} from "../app/pages/company-portal-page-path";
import {TransactionUiKeyService} from "./transaction/transaction-ui-key.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {BrandingUiKeyService} from "./branding/branding-ui-key.service";


@Injectable()
export class CompanyPageMenuService extends BasePageMenuService {


  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              protected userManagementService: UserManagementUiKeyService,
              protected companyManagementUiKeyService: CompanyManagementUiKeyService,
              protected auditErrorsService: AuditErrorsManagementUiKeyService,
              protected platformUiKeyService: PlatformUiKeyService,
              protected invoiceUiKeyService: SaleUiKeyService,
              protected vaultErrorsUiKeyService: VaultErrorsUiKeyService,
              protected sendgridSyncUiKeyService: SendgridSyncUiKeyService,
              protected sendgridSettingsUiKeyService: BrandingUiKeyService,
              protected emailUiKeyService: EmailUiKeyService,
              protected webhookUiKeyService: WebhookUiKeyService,
              protected transactionUiKeyService: TransactionUiKeyService) {
    super(settingsProvider);
    this.reInit();
    companyManagementUiKeyService.uiKeysChanged.subscribe(() => this.reInit());
  }

  private get USER_MANAGEMENT_MENU_NODE(): NbMenuItem {
    return {
      title: 'User Management',
      icon: 'people-outline',
      expanded: true
    };
  }

  private get USER_MANAGEMENT_USERS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Users',
      link: this.link(CompanyPortalPagePath.USER_MANAGE)
    };
  }

  private get USER_MANAGEMENT_ROLES_MENU_NODE(): NbMenuItem {
    return {
      title: 'Roles',
      link: this.link(CompanyPortalPagePath.ROLE_MANAGE)
    };
  }

  private get USER_MANAGEMENT_AUDIT_MENU_NODE(): NbMenuItem {
    return {
      title: 'User Activity Audit',
      link: this.link(CompanyPortalPagePath.AUDIT)
    };
  }

  private get PLATFORMS_COMPANIES_MENU_NODE(): NbMenuItem {
    return {
      title: 'Platforms & Companies',
      icon: 'grid-outline'
    };
  }

  private get PLATFORM_MENU_NODE(): NbMenuItem {
    return {
      title: 'Platforms',
      link: this.link(CompanyPortalPagePath.PLATFORM)
    };
  }

  private get ENTITIES_COMPANIES_MENU_NODE(): NbMenuItem {
    return {
      title: 'Companies',
      link: this.link(CompanyPortalPagePath.COMPANY_MANAGE)
    };
  }

  private get AUDIT_ERRORS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Audit & Errors',
      icon: 'alert-triangle-outline',
      expanded: true
    };
  }

  private get COMPANY_SETTINGS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Company Settings',
      icon: 'settings-2-outline',
      expanded: false
    };
  }

  private get COMPANY_SETTINGS_GENERAL_MENU_NODE(): NbMenuItem {
    return {
      title: 'General Settings',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_GENERAL)
    };
  }

  private get COMPANY_SETTINGS_MAILING_METHOD_MENU_NODE(): NbMenuItem {
    return {
      title: 'Mailing Options',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_MAILING_METHOD)
    };
  }

  private get COMPANY_SETTINGS_PAYMENT_SETTINGS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Payment Settings',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_PAYMENT_SETTINGS)
    };
  }


  private get COMPANY_PAYMENT_FORMS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Payment Forms',
      link: this.link(CompanyPortalPagePath.COMPANY_PAYMENT_FORMS)
    };
  }

  private get COMPANY_SETTINGS_API_TOKENS_MENU_NODE(): NbMenuItem {
    return {
      title: 'API Tokens',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_API_TOKENS)
    };
  }

  private get COMPANY_SETTINGS_TEMPLATES_MENU_NODE(): NbMenuItem {
    return {
      title: 'Templates',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_TEMPLATES)
    };
  }

  private get COMPANY_SETTINGS_CUSTOMER_PORTAL_MENU_NODE(): NbMenuItem {
    return {
      title: 'Customer Portal',
      link: this.link(CompanyPortalPagePath.COMPANY_SETTINGS_CUSTOMER_PORTAL)
    };
  }

  private get SALES_MENU_NODE(): NbMenuItem {
    return {
      title: 'Sales',
      link: this.link(CompanyPortalPagePath.SALE)
    };
  }

  private get EMAILS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Emails',
      link: this.link(CompanyPortalPagePath.EMAIL)
    };
  }

  private get BRANDING_MENU_NODE(): NbMenuItem {
    return {
      title: 'Branding',
      link: this.link(CompanyPortalPagePath.BRANDING)
    };
  }

  private get SENDGRID_SYNC_AUDIT_MENU_NODE(): NbMenuItem {
    return {
      title: 'SendGrid Sync Audit',
      link: this.link(CompanyPortalPagePath.SENDGRID_SYNC)
    };
  }

  private get API_ACTIVITY_AUDIT_MENU_NODE(): NbMenuItem {
    return {
      title: 'API Activity Audit',
      link: this.link(CompanyPortalPagePath.API_ACTIVITY)
    };
  }

  private get VAULT_ERRORS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Vault Errors',
      link: this.link(CompanyPortalPagePath.VAULT_ERRORS)
    };
  }

  private get WEBHOOK_ERRORS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Webhook Errors',
      link: this.link(CompanyPortalPagePath.WEBHOOK_ERRORS)
    };
  }

  private get TRANSACTIONS_MENU_NODE(): NbMenuItem {
    return {
      title: 'Transactions',
      link: this.link(CompanyPortalPagePath.TRANSACTIONS)
    };
  }

  protected onReInit() {
    this.menu = [];

    const userManagementNode = this.processUserManagementNode();
    if (userManagementNode) {
      this.menu.push(userManagementNode);
    }

    const platformsNode = this.processPlatformsNode();
    if (platformsNode) {
      this.menu.push(platformsNode);
    }

    const companiesNode = this.processCompaniesNode();
    if (companiesNode) {
      this.menu.push(companiesNode);
    }

    const invoicesNode = this.processInvoicesNode();
    if (invoicesNode) {
      this.menu.push(invoicesNode);
    }

    const paymentFormsNode = this.processPaymentFormsNode();
    if (paymentFormsNode) {
      this.menu.push(paymentFormsNode);
    }

    const transactionsNode = this.processTransactionsNode();
    if (transactionsNode) {
      this.menu.push(transactionsNode);
    }

    const emailNode = this.processEmailNode();
    if (emailNode) {
      this.menu.push(emailNode);
    }

    const auditErrorsMenuNode = this.processAuditAndErrorsManagementNode();
    if (auditErrorsMenuNode) {
      this.menu.push(auditErrorsMenuNode);
    }

    const brandingMenuNode = this.processBranding();
    if(brandingMenuNode){
      this.menu.push(brandingMenuNode);
    }

    this.menuChanged.emit();
  }

  private processUserManagementNode() {
    const userManagementNode = this.USER_MANAGEMENT_MENU_NODE;
    userManagementNode.children = [];
    if (this.userManagementService.showUserManagement()) {
      userManagementNode.children.push(this.USER_MANAGEMENT_USERS_MENU_NODE);
    }
    if (this.userManagementService.showRoleManagement()) {
      userManagementNode.children.push(this.USER_MANAGEMENT_ROLES_MENU_NODE);
    }
    if (userManagementNode.children.length > 0) {
      return userManagementNode;
    }
    return null;
  }

  private processAuditAndErrorsManagementNode() {
    const auditAndErrorsManagementNode = this.AUDIT_ERRORS_MENU_NODE;
    auditAndErrorsManagementNode.children = [];
    if (this.auditErrorsService.showUserAudit()) {
      auditAndErrorsManagementNode.children.push(this.USER_MANAGEMENT_AUDIT_MENU_NODE);
    }
    if (this.sendgridSyncUiKeyService.showSendgridSyncAudit()) {
      auditAndErrorsManagementNode.children.push(this.SENDGRID_SYNC_AUDIT_MENU_NODE);
    }
    if (this.auditErrorsService.showApiActivityAudit()) {
      auditAndErrorsManagementNode.children.push(this.API_ACTIVITY_AUDIT_MENU_NODE);
    }
    if (this.vaultErrorsUiKeyService.showVaultErrors()) {
      auditAndErrorsManagementNode.children.push(this.VAULT_ERRORS_MENU_NODE);
    }
    if (this.webhookUiKeyService.showWebhookErrors()) {
      auditAndErrorsManagementNode.children.push(this.WEBHOOK_ERRORS_MENU_NODE);
    }
    if (auditAndErrorsManagementNode.children.length > 0) {
      return auditAndErrorsManagementNode;
    }
    return null;
  }

  private processBranding() {
    if (this.sendgridSettingsUiKeyService.showBranding()) {
      return this.BRANDING_MENU_NODE;
    }
    return null;
  }

  private processPlatformsNode() {
    if (this.platformUiKeyService.showPlatforms()) {
      return this.PLATFORM_MENU_NODE;
    } else {
      return null;
    }
  }

  private processCompaniesNode() {
    if (this.userManagementService.showCompanyAdministration()) {
      return this.ENTITIES_COMPANIES_MENU_NODE;
    } else if (this.companyManagementUiKeyService.showCompanySettings()) {
      const node = this.COMPANY_SETTINGS_MENU_NODE;
      node.children = [this.COMPANY_SETTINGS_GENERAL_MENU_NODE, this.COMPANY_SETTINGS_MAILING_METHOD_MENU_NODE, this.COMPANY_SETTINGS_PAYMENT_SETTINGS_MENU_NODE, this.COMPANY_SETTINGS_API_TOKENS_MENU_NODE];
      if (this.companyManagementUiKeyService.showCompanySettingsTemplates()) {
        node.children.push(this.COMPANY_SETTINGS_TEMPLATES_MENU_NODE);
      }
      if (this.companyManagementUiKeyService.showCompanySettingsCustomerPortal()) {
        node.children.push(this.COMPANY_SETTINGS_CUSTOMER_PORTAL_MENU_NODE);
      }
      return node;
    } else {
      return null;
    }
  }

  private processInvoicesNode() {
    if (this.invoiceUiKeyService.showInvoices()) {
      return this.SALES_MENU_NODE;
    } else {
      return null;
    }
  }

  private processEmailNode() {
    if (this.emailUiKeyService.showEmails()) {
      return this.EMAILS_MENU_NODE;
    } else {
      return null;
    }
  }

  private processTransactionsNode() {
    if (this.transactionUiKeyService.showTransactions()) {
      return this.TRANSACTIONS_MENU_NODE;
    } else {
      return null;
    }
  }

  private processPaymentFormsNode() {
    if (this.companyManagementUiKeyService.showCompanyPaymentForms()) {
      return this.COMPANY_PAYMENT_FORMS_MENU_NODE;
    } else {
      return null;
    }
  }


}
