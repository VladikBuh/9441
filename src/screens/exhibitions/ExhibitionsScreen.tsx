import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Share,
  Platform,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useAppNavigation} from '../../navigation/NavigationContext';
import {Colors} from '../../theme/colors';
import {EXHIBITIONS} from '../../data/exhibitions';
import {ExhibitionCard} from '../../components/ExhibitionCard';
import {Exhibition} from '../../types';

const DARK_MAP_STYLE = [
  {elementType: 'geometry', stylers: [{color: '#0D66A6'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#B3DFFF'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#063050'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#0F74BD'}]},
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#063050'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#7BC2F5'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#063A6A'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#66BFFF'}],
  },
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'transit', stylers: [{visibility: 'off'}]},
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{color: '#0F74BD'}],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [{visibility: 'off'}],
  },
];

const INITIAL_REGION = {
  latitude: 55,
  longitude: 20,
  latitudeDelta: 55,
  longitudeDelta: 100,
};

type TabType = 'cards' | 'map';

interface RouteModalState {
  visible: boolean;
  exhibition: Exhibition | null;
}

export const ExhibitionsScreen: React.FC = () => {
  const [tab, setTab] = useState<TabType>('cards');
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const markerJustPressed = useRef(false);
  const [routeModal, setRouteModal] = useState<RouteModalState>({
    visible: false,
    exhibition: null,
  });
  const {openExhibitionDetail} = useAppNavigation();

  const selectedExhibition = EXHIBITIONS.find(e => e.id === selectedMarker);

  const shareExhibition = (ex: Exhibition) => {
    Share.share({
      title: ex.title,
      message: `${ex.title}\n${ex.location}\n${ex.coordinates.lat.toFixed(4)}°, ${ex.coordinates.lon.toFixed(4)}°`,
    }).catch(() => {});
  };

  const SegmentControl = (
    <View style={styles.ExhibitionsScreenSegmentRow}>
      {(['cards', 'map'] as TabType[]).map(t => (
        <TouchableOpacity
          key={t}
          style={[
            styles.ExhibitionsScreenSegmentBtn,
            tab === t && styles.ExhibitionsScreenSegmentActive,
          ]}
          onPress={() => setTab(t)}>
          <Text
            style={[
              styles.ExhibitionsScreenSegmentText,
              tab === t && styles.ExhibitionsScreenSegmentTextActive,
            ]}>
            {t === 'cards' ? 'Exhibition Cards' : 'Map'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.ExhibitionsScreenContainer}>
      {tab === 'cards' ? (
        /* ── Cards tab: header + segment scroll with content ── */
        <ScrollView
          style={styles.ExhibitionsScreenList}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.ExhibitionsScreenHeader}>
            <Text style={styles.ExhibitionsScreenScreenTitle}>
              Sculpted Exhibitions
            </Text>
            <Text style={styles.ExhibitionsScreenScreenSubtitle}>
              Explore ice art locations, dates, coordinates, and crystal
              displays around the world.
            </Text>
          </View>
          {SegmentControl}
          <View style={styles.ExhibitionsScreenCardsContent}>
            {EXHIBITIONS.map(ex => (
              <ExhibitionCard
                key={ex.id}
                exhibition={ex}
                onPress={() => openExhibitionDetail(ex)}
              />
            ))}
            <View style={styles.ExhibitionsScreenBottomSpacer} />
          </View>
        </ScrollView>
      ) : (
        /* ── Map tab: fixed header + segment + full-screen map ── */
        <View style={styles.ExhibitionsScreenMapTabContainer}>
          <View style={styles.ExhibitionsScreenHeader}>
            <Text style={styles.ExhibitionsScreenScreenTitle}>
              Sculpted Exhibitions
            </Text>
            <Text style={styles.ExhibitionsScreenScreenSubtitle}>
              Explore ice art locations, dates, coordinates, and crystal
              displays around the world.
            </Text>
          </View>
          {SegmentControl}

          <View style={styles.ExhibitionsScreenMapWrapper}>
            <MapView
              style={styles.ExhibitionsScreenMap}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={INITIAL_REGION}
              userInterfaceStyle="dark"
              customMapStyle={
                Platform.OS === 'android' ? DARK_MAP_STYLE : undefined
              }
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={false}
              showsScale={false}
              toolbarEnabled={false}
              onPress={() => {
                if (markerJustPressed.current) {
                  markerJustPressed.current = false;
                  return;
                }
                setSelectedMarker(null);
              }}>
              {EXHIBITIONS.map(ex => {
                const isSelected = ex.id === selectedMarker;
                return (
                  <Marker
                    key={ex.id}
                    coordinate={{
                      latitude: ex.coordinates.lat,
                      longitude: ex.coordinates.lon,
                    }}
                    onPress={() => {
                      markerJustPressed.current = true;
                      setSelectedMarker(isSelected ? null : ex.id);
                    }}
                    tracksViewChanges={false}>
                    <View
                      style={[
                        styles.ExhibitionsScreenMarkerOuter,
                        isSelected &&
                          styles.ExhibitionsScreenMarkerOuterSelected,
                      ]}>
                      <View
                        style={[
                          styles.ExhibitionsScreenMarkerInner,
                          isSelected &&
                            styles.ExhibitionsScreenMarkerInnerSelected,
                        ]}
                      />
                    </View>
                  </Marker>
                );
              })}
            </MapView>

            {/* Marker info card */}
            {selectedExhibition && (
              <View style={styles.ExhibitionsScreenMarkerCard}>
                <View style={styles.ExhibitionsScreenMarkerCardHeader}>
                  <Text style={styles.ExhibitionsScreenMarkerCardTitle}>
                    {selectedExhibition.title}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedMarker(null)}>
                    <Text style={styles.ExhibitionsScreenMarkerCardClose}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.ExhibitionsScreenMarkerCardLocation}>
                  📍 {selectedExhibition.location}
                </Text>
                <Text style={styles.ExhibitionsScreenMarkerCardCoords}>
                  {selectedExhibition.coordinates.lat.toFixed(4)}°,{' '}
                  {selectedExhibition.coordinates.lon.toFixed(4)}°
                </Text>
                <View style={styles.ExhibitionsScreenMarkerCardBtns}>
                  <TouchableOpacity
                    style={styles.ExhibitionsScreenMarkerCardBtn}
                    onPress={() => {
                      setSelectedMarker(null);
                      openExhibitionDetail(selectedExhibition!);
                    }}>
                    <Text style={styles.ExhibitionsScreenMarkerCardBtnText}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.ExhibitionsScreenMarkerCardBtn,
                      styles.ExhibitionsScreenMarkerCardBtnRed,
                    ]}
                    onPress={() =>
                      setRouteModal({
                        visible: true,
                        exhibition: selectedExhibition,
                      })
                    }>
                    <Text
                      style={[
                        styles.ExhibitionsScreenMarkerCardBtnText,
                        {color: Colors.frostWhite},
                      ]}>
                      Build Tour
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Tour modal */}
      <Modal visible={routeModal.visible} transparent animationType="slide">
        <View style={styles.ExhibitionsScreenRouteOverlay}>
          <View style={styles.ExhibitionsScreenRouteCard}>
            <Text style={styles.ExhibitionsScreenRouteTitle}>
              Tour Preview
            </Text>
            {routeModal.exhibition && (
              <>
                <View style={styles.ExhibitionsScreenRouteRow}>
                  <Text style={styles.ExhibitionsScreenRouteLabel}>
                    Destination
                  </Text>
                  <Text style={styles.ExhibitionsScreenRouteValue}>
                    {routeModal.exhibition.title}
                  </Text>
                </View>
                <View style={styles.ExhibitionsScreenRouteRow}>
                  <Text style={styles.ExhibitionsScreenRouteLabel}>
                    Location
                  </Text>
                  <Text style={styles.ExhibitionsScreenRouteValue}>
                    {routeModal.exhibition.location}
                  </Text>
                </View>
                <View style={styles.ExhibitionsScreenRouteRow}>
                  <Text style={styles.ExhibitionsScreenRouteLabel}>
                    Coordinates
                  </Text>
                  <Text style={styles.ExhibitionsScreenRouteValue}>
                    {routeModal.exhibition.coordinates.lat.toFixed(4)}°,{' '}
                    {routeModal.exhibition.coordinates.lon.toFixed(4)}°
                  </Text>
                </View>
                <Text style={styles.ExhibitionsScreenRouteNote}>
                  Open your maps app to navigate to this exhibition location.
                </Text>
                <View style={styles.ExhibitionsScreenRouteBtns}>
                  <TouchableOpacity
                    style={styles.ExhibitionsScreenRouteOpenBtn}
                    onPress={() => {
                      shareExhibition(routeModal.exhibition!);
                      setRouteModal({visible: false, exhibition: null});
                    }}>
                    <Text style={styles.ExhibitionsScreenRouteOpenBtnText}>
                      Share
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.ExhibitionsScreenRouteCloseBtn}
                    onPress={() =>
                      setRouteModal({visible: false, exhibition: null})
                    }>
                    <Text style={styles.ExhibitionsScreenRouteCloseBtnText}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ExhibitionsScreenContainer: {flex: 1, backgroundColor: Colors.arcticNavy},

  /* Cards tab */
  ExhibitionsScreenList: {flex: 1},
  ExhibitionsScreenHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    backgroundColor: Colors.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  ExhibitionsScreenScreenTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  ExhibitionsScreenScreenSubtitle: {
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },

  ExhibitionsScreenSegmentRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.deepIceBlue,
  },
  ExhibitionsScreenSegmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  ExhibitionsScreenSegmentActive: {
    backgroundColor: Colors.deepIceBlue,
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  ExhibitionsScreenSegmentText: {
    color: Colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },

  ExhibitionsScreenSegmentTextActive: {color: Colors.crystalCyan},
  ExhibitionsScreenCardsContent: {paddingHorizontal: 16},
  ExhibitionsScreenBottomSpacer: {height: 20},

  /* Map tab */
  ExhibitionsScreenMapTabContainer: {flex: 1},
  ExhibitionsScreenMapWrapper: {flex: 1},
  ExhibitionsScreenMap: {flex: 1},

  /* Markers */
  ExhibitionsScreenMarkerOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.crystalCyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.frostWhite,
    shadowColor: Colors.crystalCyan,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  ExhibitionsScreenMarkerOuterSelected: {
    backgroundColor: Colors.sculpturalRed,
    shadowColor: Colors.sculpturalRed,
  },
  ExhibitionsScreenMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.frostWhite,
  },
  ExhibitionsScreenMarkerInnerSelected: {
    backgroundColor: Colors.frostWhite,
  },

  /* Marker info card */
  ExhibitionsScreenMarkerCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.solidCardNavy,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderIce,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  ExhibitionsScreenMarkerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ExhibitionsScreenMarkerCardTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  ExhibitionsScreenMarkerCardClose: {
    color: Colors.mutedText,
    fontSize: 16,
    padding: 4,
  },
  ExhibitionsScreenMarkerCardLocation: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },

  ExhibitionsScreenMarkerCardCoords: {
    color: Colors.mutedText,
    fontSize: 11,
    fontFamily: 'Courier',
    marginBottom: 12,
  },
  ExhibitionsScreenMarkerCardBtns: {flexDirection: 'row', gap: 10},
  ExhibitionsScreenMarkerCardBtn: {
    flex: 1,
    backgroundColor: Colors.brightArctic,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  ExhibitionsScreenMarkerCardBtnRed: {backgroundColor: Colors.sculpturalRed},
  ExhibitionsScreenMarkerCardBtnText: {
    color: Colors.arcticNavy,
    fontSize: 13,
    fontWeight: '700',
  },

  /* Route modal */
  ExhibitionsScreenRouteOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  },
  ExhibitionsScreenRouteCard: {
    backgroundColor: Colors.solidCardNavy,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1,
    borderColor: Colors.borderIce,
  },
  ExhibitionsScreenRouteTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  ExhibitionsScreenRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepIceBlue,
  },
  ExhibitionsScreenRouteLabel: {
    color: Colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  ExhibitionsScreenRouteValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  ExhibitionsScreenRouteNote: {
    color: Colors.mutedText,
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 19,
  },
  ExhibitionsScreenRouteBtns: {flexDirection: 'row', gap: 12},
  ExhibitionsScreenRouteOpenBtn: {
    flex: 1,
    backgroundColor: Colors.crystalCyan,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ExhibitionsScreenRouteOpenBtnText: {
    color: Colors.arcticNavy,
    fontWeight: '700',
    fontSize: 15,
  },

  ExhibitionsScreenRouteCloseBtn: {
    flex: 1,
    backgroundColor: Colors.darkPanel,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderIce,
  },
  ExhibitionsScreenRouteCloseBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
});
