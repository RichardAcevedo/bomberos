import { ROUTES } from '../commons/constants';

const routes = [
  {
    path: '/',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: ROUTES.personal.alterOwnCurriculum, component: () => import('pages/AlterOwnCurriculum.vue') },
      { path: ROUTES.personal.curriculum, component: () => import('pages/Curriculum.vue') },
      { path: ROUTES.personal.alterCurriculum, component: () => import('pages/AlterCurriculum.vue') },
      { path: ROUTES.personal.persons, component: () => import('pages/Persons.vue') },
      { path: ROUTES.personal.alterPersons, component: () => import('pages/AlterPersons.vue') },
      { path: ROUTES.personal.promotions, component: () => import('pages/Promotions.vue') },
      { path: ROUTES.personal.alterPromotions, component: () => import('pages/AlterPromotions.vue') },
      { path: ROUTES.personal.awards, component: () => import('pages/Awards.vue') },
      { path: ROUTES.personal.alterAwards, component: () => import('pages/AlterAwards.vue') },
      { path: ROUTES.personal.awardTypes, component: () => import('pages/AwardTypes.vue') },
      { path: ROUTES.personal.appointments, component: () => import('pages/Appointments.vue') },
      { path: ROUTES.personal.alterAppointments, component: () => import('pages/AlterAppointments.vue') },
      { path: ROUTES.personal.sanctions, component: () => import('pages/Sanctions.vue') },
      { path: ROUTES.personal.alterSanctions, component: () => import('pages/AlterSanctions.vue') },
      { path: ROUTES.personal.ranks, component: () => import('pages/Ranks.vue') },
      { path: ROUTES.personal.rankCategories, component: () => import('pages/RankCategories.vue') },
      { path: ROUTES.personal.positions, component: () => import('pages/Positions.vue') },
      { path: ROUTES.personal.logs, component: () => import('pages/Logs.vue') },
      { path: ROUTES.bills.bills, component: () => import('pages/Bills.vue') },
      { path: ROUTES.bills.alterBills, component: () => import('pages/AlterBills.vue') },
      { path: ROUTES.bills.issueTypes, component: () => import('pages/IssueTypes.vue') },
      { path: ROUTES.vehicles.vehicles, component: () => import('pages/Vehicles.vue') },
      { path: ROUTES.vehicles.alterVehicles, component: () => import('pages/AlterVehicles.vue') },
      { path: ROUTES.vehicles.vehicleTypes, component: () => import('pages/VehicleTypes.vue') },
      { path: ROUTES.vehicles.elements, component: () => import('pages/Elements.vue') },
      { path: ROUTES.vehicles.radios, component: () => import('pages/Radios.vue') },
      { path: ROUTES.vehicles.alterRadios, component: () => import('pages/AlterRadios.vue') },
      {
        path: ROUTES.bills.directory,
        component: () => import('pages/Directory.vue'),
      },
      {
        path: ROUTES.bills.emergencyNumbers,
        component: () => import('pages/EmergencyNumbers.vue'),
      },
      {
        path: ROUTES.bills.emergency,
        component: () => import('pages/emergency.vue'),
      },
      {
        path: ROUTES.preventionAndSecurity.companies,
        component: () => import('pages/Companies.vue'),
      },
      {
        path: ROUTES.preventionAndSecurity.alterCompanies,
        component: () => import('pages/AlterCompanies.vue'),
      },
      {
        path: ROUTES.preventionAndSecurity.companiesTypes,
        component: () => import('pages/CompanyTypes.vue'),
      },
      {
        path: ROUTES.preventionAndSecurity.certificates,
        component: () => import('pages/Certificates.vue'),
      },
      {
        path: ROUTES.extinguishers.extinguishers,
        component: () => import('pages/Extinguishers.vue'),
      },
      {
        path: ROUTES.extinguishers.alterExtinguishers,
        component: () => import('pages/AlterExtinguishers.vue'),
      },
      {
        path: ROUTES.extinguishers.extinguisherTypes,
        component: () => import('pages/ExtinguisherTypes.vue'),
      },
      {
        path: ROUTES.extinguishers.customers,
        component: () => import('pages/Customers.vue'),
      },
      { path: ROUTES.reports.curriculumReports, component: () => import('pages/CurriculumReports.vue') },
      { path: ROUTES.reports.billReports, component: () => import('pages/BillReports.vue') },
      { path: ROUTES.reports.specificReports, component: () => import('pages/SpecificReports.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
